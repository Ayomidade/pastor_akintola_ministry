import { findSubscriberByEmail } from "../models/newsletter.model.js";
import { sendEmail} from "../config/mailer.js";
import { ObjectId } from "mongodb";
import dotenv from "dotenv";
import { newsletter } from "../config/db.js";

dotenv.config();

export async function subscribe(req, res) {
  const { email, name } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    const existing = await findSubscriberByEmail(email);
    if (existing) {
      return res.status(409).json({ message: "Email already subscribed." });
    }

    await newsletter().insertOne({
      email,
      name: name || null,
      subscribedAt: new Date(),
    });
    return res.status(201).json({ message: "Subscribed successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function getSubscribers(req, res) {
  try {
    const subscribers = await newsletter()
      .find({})
      .sort({ subscribedAt: -1 })
      .toArray();
    return res.status(200).json({ subscribers });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function unsubscribe(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    await newsletter().deleteOne({ email });
    return res.status(200).json({ message: "Unsubscribed." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

// ─── Bulk Email ───────────────────────────────────────────────────

export async function sendBulkEmail(req, res) {
  const { subject, message, recipientIds } = req.body;

  if (!subject || !message) {
    return res
      .status(400)
      .json({ message: "Subject and message are required." });
  }

  try {
    let recipients = [];

    if (
      recipientIds &&
      Array.isArray(recipientIds) &&
      recipientIds.length > 0
    ) {
      // Send to specific selected subscribers
      const objectIds = recipientIds.map((id) => new ObjectId(id));
      recipients = await newsletter()
        .find({ _id: { $in: objectIds } })
        .toArray();
    } else {
      // Send to all subscribers
      recipients = await newsletter().find({}).toArray();
    }

    if (recipients.length === 0) {
      return res.status(400).json({ message: "No recipients found." });
    }

    // Build email HTML template
    const emailHtml = buildEmailTemplate({ subject, message });

    // Send emails in batches of 10 to avoid overwhelming the SMTP server
    const BATCH_SIZE = 10;
    const results = { sent: 0, failed: 0, failedEmails: [] };

    for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
      const batch = recipients.slice(i, i + BATCH_SIZE);

      await Promise.allSettled(
        batch.map(async (recipient) => {
          try {
            await sendEmail({
              // from: process.env.EMAIL_FROM,
              to: recipient.email,
              subject,
              text: message, // plain text fallback
              html: emailHtml,
            });
            results.sent++;
          } catch (err) {
            console.error(`Failed to send to ${recipient.email}:`, err.message);
            results.failed++;
            results.failedEmails.push(recipient.email);
          }
        }),
      );

      // Small delay between batches to respect SMTP rate limits
      if (i + BATCH_SIZE < recipients.length) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    return res.status(200).json({
      message: `Email sent to ${results.sent} subscriber(s).`,
      results,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

// ─── Email template builder ───────────────────────────────────────

function buildEmailTemplate({ subject, message }) {
  // Convert plain text line breaks to <br> for HTML
  const formattedMessage = message
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br />");

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>${subject}</title>
    </head>
    <body style="margin:0;padding:0;background:#F0FAF4;font-family:'Helvetica Neue',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0FAF4;padding:40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0"
              style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

              <!-- Header -->
              <tr>
                <td style="background:#212121;padding:32px 40px;text-align:center;">
                  <p style="margin:0 0 4px;font-size:22px;font-weight:700;color:#16A34A;
                    font-family:Georgia,serif;">
                    Pastor Daniel Akintola
                  </p>
                </td>
              </tr>

              <!-- Green accent line -->
              <tr>
                <td style="background:#16A34A;height:4px;"></td>
              </tr>

              <!-- Subject -->
              <tr>
                <td style="padding:36px 40px 8px;">
                  <h1 style="margin:0;font-size:24px;color:#111111;
                    font-family:Georgia,serif;line-height:1.3;">
                    ${subject}
                  </h1>
                </td>
              </tr>

              <!-- Divider -->
              <tr>
                <td style="padding:0 40px 24px;">
                  <div style="width:48px;height:3px;background:#16A34A;"></div>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:0 40px 36px;">
                  <p style="margin:0;font-size:15px;color:#404040;
                    line-height:1.85;">
                    ${formattedMessage}
                  </p>
                </td>
              </tr>

              <!-- CTA -->
              <tr>
                <td style="padding:0 40px 40px;">
                  <a href="${process.env.CLIENT_URL}"
                    style="display:inline-block;background:#16A34A;color:#ffffff;
                    padding:12px 28px;border-radius:4px;font-size:12px;
                    font-weight:700;letter-spacing:1px;text-transform:uppercase;
                    text-decoration:none;">
                    Visit Our Website
                  </a>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#F0FAF4;padding:24px 40px;
                  border-top:1px solid #E5E5E5;">
                  <p style="margin:0 0 8px;font-size:12px;color:#737373;
                    text-align:center;">
                    You are receiving this because you subscribed to our newsletter.
                  </p>
                  <p style="margin:0;font-size:12px;color:#737373;text-align:center;">
                    © ${new Date().getFullYear()} Pastor Daniel Akintola.
                    All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
