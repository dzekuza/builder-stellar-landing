import { RequestHandler } from "express";
import { sendEmail, emailTemplates } from "../lib/email";

export const sendTestEmail: RequestHandler = async (req, res) => {
  try {
    console.log("Sending test invitation email...");

    const template = emailTemplates.teamInvitation(
      "Demo Company Admin",
      "EventFlow Demo Company",
      "DJ",
      "https://your-eventflow-app.netlify.app/invite/demo123",
    );

    await sendEmail({
      to: "dzekuza@gmail.com",
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    console.log("Test email sent successfully!");
    res.json({
      success: true,
      message: "Test invitation email sent successfully to dzekuza@gmail.com",
    });
  } catch (error) {
    console.error("Failed to send test email:", error);
    res.status(500).json({
      success: false,
      error: "Failed to send test email",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
