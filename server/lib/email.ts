import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const fromDomain = process.env.EMAIL_FROM_DOMAIN || "teamup.lt";

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions) {
  try {
    const response = await resend.emails.send({
      from: `EventFlow <noreply@${fromDomain}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    console.log("Email sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
}

// Pre-built email templates
export const emailTemplates = {
  eventCreated: (eventName: string, eventDate: string, venue: string) => ({
    subject: `Event Created: ${eventName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8B5CF6;">New Event Created</h2>
        <p>Your event <strong>${eventName}</strong> has been successfully created!</p>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Event Details:</h3>
          <p><strong>Event:</strong> ${eventName}</p>
          <p><strong>Date:</strong> ${eventDate}</p>
          <p><strong>Venue:</strong> ${venue}</p>
        </div>
        <p>You can manage your event through the EventFlow dashboard.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
        <p style="color: #64748b; font-size: 14px;">Best regards,<br>The EventFlow Team</p>
      </div>
    `,
    text: `New Event Created\n\nYour event "${eventName}" has been successfully created!\n\nEvent Details:\nEvent: ${eventName}\nDate: ${eventDate}\nVenue: ${venue}\n\nYou can manage your event through the EventFlow dashboard.\n\nBest regards,\nThe EventFlow Team`,
  }),

  eventUpdated: (eventName: string, eventDate: string, venue: string) => ({
    subject: `Event Updated: ${eventName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3B82F6;">Event Updated</h2>
        <p>Your event <strong>${eventName}</strong> has been updated.</p>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Updated Event Details:</h3>
          <p><strong>Event:</strong> ${eventName}</p>
          <p><strong>Date:</strong> ${eventDate}</p>
          <p><strong>Venue:</strong> ${venue}</p>
        </div>
        <p>View your updated event in the EventFlow dashboard.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
        <p style="color: #64748b; font-size: 14px;">Best regards,<br>The EventFlow Team</p>
      </div>
    `,
    text: `Event Updated\n\nYour event "${eventName}" has been updated.\n\nUpdated Event Details:\nEvent: ${eventName}\nDate: ${eventDate}\nVenue: ${venue}\n\nView your updated event in the EventFlow dashboard.\n\nBest regards,\nThe EventFlow Team`,
  }),

  songRequestReceived: (
    songName: string,
    artist: string,
    amount: number,
    eventName: string,
  ) => ({
    subject: `New Song Request: ${songName} by ${artist}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8B5CF6;">🎵 New Song Request</h2>
        <p>You have received a new song request for your event <strong>${eventName}</strong>!</p>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Song Request Details:</h3>
          <p><strong>Song:</strong> ${songName}</p>
          <p><strong>Artist:</strong> ${artist}</p>
          <p><strong>Amount:</strong> $${amount.toFixed(2)}</p>
          <p><strong>Event:</strong> ${eventName}</p>
        </div>
        <p>Check your live event dashboard to manage this request.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
        <p style="color: #64748b; font-size: 14px;">Best regards,<br>The EventFlow Team</p>
      </div>
    `,
    text: `🎵 New Song Request\n\nYou have received a new song request for your event "${eventName}"!\n\nSong Request Details:\nSong: ${songName}\nArtist: ${artist}\nAmount: $${amount.toFixed(2)}\nEvent: ${eventName}\n\nCheck your live event dashboard to manage this request.\n\nBest regards,\nThe EventFlow Team`,
  }),

  drinkOrderReceived: (
    drinkName: string,
    quantity: number,
    totalPrice: number,
    eventName: string,
  ) => ({
    subject: `New Drink Order: ${quantity}x ${drinkName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3B82F6;">☕ New Drink Order</h2>
        <p>You have received a new drink order for your event <strong>${eventName}</strong>!</p>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Order Details:</h3>
          <p><strong>Drink:</strong> ${drinkName}</p>
          <p><strong>Quantity:</strong> ${quantity}</p>
          <p><strong>Total:</strong> $${totalPrice.toFixed(2)}</p>
          <p><strong>Event:</strong> ${eventName}</p>
        </div>
        <p>Check your barista dashboard to prepare this order.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
        <p style="color: #64748b; font-size: 14px;">Best regards,<br>The EventFlow Team</p>
      </div>
    `,
    text: `☕ New Drink Order\n\nYou have received a new drink order for your event "${eventName}"!\n\nOrder Details:\nDrink: ${drinkName}\nQuantity: ${quantity}\nTotal: $${totalPrice.toFixed(2)}\nEvent: ${eventName}\n\nCheck your barista dashboard to prepare this order.\n\nBest regards,\nThe EventFlow Team`,
  }),

  eventReminder: (eventName: string, eventDate: string, venue: string) => ({
    subject: `Event Reminder: ${eventName} Tomorrow`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10B981;">🎉 Event Reminder</h2>
        <p>Your event <strong>${eventName}</strong> is scheduled for tomorrow!</p>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Event Details:</h3>
          <p><strong>Event:</strong> ${eventName}</p>
          <p><strong>Date:</strong> ${eventDate}</p>
          <p><strong>Venue:</strong> ${venue}</p>
        </div>
        <p>Make sure you're ready for an amazing event! Check your dashboard for any last-minute preparations.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
        <p style="color: #64748b; font-size: 14px;">Best regards,<br>The EventFlow Team</p>
      </div>
    `,
    text: `🎉 Event Reminder\n\nYour event "${eventName}" is scheduled for tomorrow!\n\nEvent Details:\nEvent: ${eventName}\nDate: ${eventDate}\nVenue: ${venue}\n\nMake sure you're ready for an amazing event! Check your dashboard for any last-minute preparations.\n\nBest regards,\nThe EventFlow Team`,
  }),
};
