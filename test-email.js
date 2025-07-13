import { sendEmail, emailTemplates } from "./server/lib/email.js";

async function testEmail() {
  try {
    console.log("Testing team invitation email...");

    const template = emailTemplates.teamInvitation(
      "Demo Company Admin",
      "EventFlow Demo Company",
      "DJ",
      "https://your-app-url.com/invite/abc123",
    );

    await sendEmail({
      to: "dzekuza@gmail.com",
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    console.log("Test email sent successfully to dzekuza@gmail.com!");
  } catch (error) {
    console.error("Failed to send test email:", error);
  }
}

testEmail();
