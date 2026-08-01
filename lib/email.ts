import Mailgun from "mailgun.js";
import type { ApplicationStatus } from "./generated/prisma/enums";

interface MailgunClientContext {
  client: ReturnType<InstanceType<typeof Mailgun>["client"]>;
  domain: string;
}

function getClient(): MailgunClientContext {
  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;

  if (!apiKey || !domain) {
    throw new Error("Mailgun is not configured: set MAILGUN_API_KEY and MAILGUN_DOMAIN");
  }

  // mailgun.js >= 3 takes a FormData implementation; Node 18+ provides one
  // as a global, so no separate `form-data` dependency is needed.
  const mailgun = new Mailgun(FormData);
  const client = mailgun.client({ username: "api", key: apiKey });

  return { client, domain };
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").trim();
}

interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Sends a single email through Mailgun. Throws if Mailgun isn't configured
 * or the send itself fails.
 */
export async function sendEmail({ to, subject, html, text }: SendEmailInput): Promise<void> {
  const { client, domain } = getClient();

  try {
    await client.messages.create(domain, {
      from: `TRUNKS <no-reply@${domain}>`,
      to: [to],
      subject,
      html,
      text: text ?? stripHtml(html),
    });
  } catch (error) {
    console.error("Failed to send email via Mailgun:", error);
    throw new Error("Failed to send email");
  }
}

/**
 * Sends the email-verification link a new user must click to confirm their
 * address (see `User.emailVerified`).
 */
export async function sendVerificationEmail(to: string, verificationUrl: string): Promise<void> {
  await sendEmail({
    to,
    subject: "Verify your TRUNKS account",
    html: `
      <p>Welcome to TRUNKS!</p>
      <p>Please verify your email address to activate your account:</p>
      <p><a href="${verificationUrl}">${verificationUrl}</a></p>
    `,
  });
}

const APPLICATION_STATUS_MESSAGES: Record<ApplicationStatus, string> = {
  APPLIED: "has been received",
  REVIEWED: "has been reviewed",
  SHORTLISTED: "has been shortlisted",
  REJECTED: "was not selected to move forward",
  OFFERED: "has resulted in a job offer",
};

/**
 * Notifies a candidate that their application status changed
 * (mirrors an `ApplicationStatusHistory` entry).
 */
export async function sendApplicationStatusEmail(
  to: string,
  jobTitle: string,
  status: ApplicationStatus
): Promise<void> {
  await sendEmail({
    to,
    subject: `Update on your application for ${jobTitle}`,
    html: `<p>Your application for <strong>${jobTitle}</strong> ${APPLICATION_STATUS_MESSAGES[status]}.</p>`,
  });
}
