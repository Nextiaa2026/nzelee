import { Elysia } from "elysia";
import { apiFail, apiOk } from "@/lib/http/api-result";
import { createTicketSchema } from "@/lib/validations/ticket";
import { createTicket } from "../services/ticket.service";

/**
 * Public ticket controller for contact form submissions.
 */
export const ticketController = new Elysia().post(
  "/tickets",
  async ({ body, set }) => {
    const parsed = createTicketSchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return apiFail(
        "VALIDATION",
        parsed.error.issues[0]?.message ?? "Invalid ticket data",
      );
    }

    try {
      const ticket = await createTicket(parsed.data);
      set.status = 201;
      return apiOk({ id: ticket.id, message: "Ticket created successfully" });
    } catch (error) {
      set.status = 500;
      return apiFail(
        "SERVER_ERROR",
        error instanceof Error ? error.message : "Failed to create ticket",
      );
    }
  },
);
