import { applyNotchWebhookOrPollStatus } from "@/backend/services/investment-checkout.service";
import { NotchPayService } from "@/backend/services/notchpay.service";

/**
 * Notch Pay server-to-server webhook. Uses the **raw** request body so HMAC
 * verification matches what Notch Pay signed.
 *
 * Dashboard URL to configure in Notch Pay: `https://<your-domain>/api/webhooks/notchpay`
 */
export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature =
    request.headers.get("x-notch-signature") ??
    request.headers.get("x-notchpay-signature") ??
    request.headers.get("X-NotchPay-Signature") ??
    "";

  let notch: NotchPayService;
  try {
    notch = new NotchPayService();
  } catch {
    return Response.json(
      { ok: false, error: "Payment provider is not configured." },
      { status: 503 },
    );
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const normalizedBody = JSON.stringify(parsed);
  const validSignature =
    notch.validateWebhookSignature(rawBody, signature) ||
    notch.validateWebhookSignature(normalizedBody, signature);

  if (!validSignature) {
    return Response.json(
      { ok: false, error: "Invalid signature" },
      { status: 401 },
    );
  }

  const tx = parsed.transaction as Record<string, unknown> | undefined;
  const reference =
    (typeof parsed.reference === "string" && parsed.reference) ||
    (typeof tx?.reference === "string" ? tx.reference : "") ||
    (typeof tx?.id === "string" ? tx.id : "");
  const status =
    (typeof parsed.status === "string" && parsed.status) ||
    (typeof tx?.status === "string" ? tx.status : "");
  const providerTxnId = typeof tx?.id === "string" ? tx.id : undefined;

  if (!reference || !status) {
    return Response.json(
      { ok: false, error: "Missing reference or status" },
      { status: 400 },
    );
  }

  const out = await applyNotchWebhookOrPollStatus(
    reference,
    status,
    providerTxnId,
  );
  if (!out.ok) {
    return Response.json({ ok: false, error: out.message }, { status: 404 });
  }

  return Response.json({ ok: true });
}
