import { VerifyEmailOtpForm } from "@/components/verify-email-otp-form";

type Props = {
  searchParams: Promise<{ email?: string }>;
};

export default async function RegisterVerificationSentPage({ searchParams }: Props) {
  const { email } = await searchParams;
  const displayEmail = email?.trim() ?? null;

  return (
    <div className="flex w-full flex-col gap-6 text-left">
      <p className="text-sm text-black/65">
        Nous avons envoyé un code à 6 chiffres à votre adresse email — saisissez-le ci-dessous pour terminer l&apos;inscription. Vérifiez vos spams, ou utilisez{" "}
        <span className="font-medium text-black">Renvoyer le code</span> ici ou{" "}
        <span className="font-medium text-black">Renvoyer la vérification</span> lors de la connexion.
      </p>

      <VerifyEmailOtpForm initialEmail={displayEmail} />
    </div>
  );
}
