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
// Helper function for role-specific features
function getRoleFeatures(role: string): string {
  switch (role.toUpperCase()) {
    case "DJ":
      return `
        <li>Receive and manage song requests in real-time</li>
        <li>Track earnings from song requests</li>
        <li>Set your own pricing for requests</li>
        <li>View detailed analytics on your performances</li>
      `;
    case "BARISTA":
      return `
        <li>Manage digital drink menus</li>
        <li>Receive and fulfill drink orders</li>
        <li>Track inventory and sales</li>
        <li>View customer preferences and analytics</li>
      `;
    case "HOST":
      return `
        <li>Coordinate events and activities</li>
        <li>Manage guest interactions</li>
        <li>Oversee event flow and timing</li>
        <li>Access event analytics and feedback</li>
      `;
    default:
      return `
        <li>Access to the EventFlow platform</li>
        <li>Collaborate with your team</li>
        <li>Manage event activities</li>
        <li>Track performance metrics</li>
      `;
  }
}

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

  teamInvitation: (
    inviterName: string,
    companyName: string,
    role: string,
    inviteLink: string,
  ) => ({
    subject: `You're invited to join ${companyName}'s team on EventFlow`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="display: inline-block; padding: 10px 20px; background: linear-gradient(135deg, #8B5CF6, #3B82F6); border-radius: 12px; margin-bottom: 20px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" fill="white"/>
            </svg>
          </div>
          <h1 style="color: #1f2937; margin: 0;">You're Invited!</h1>
        </div>

        <div style="background: #f8fafc; padding: 30px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #8B5CF6;">
          <h2 style="color: #8B5CF6; margin-top: 0;">Join ${companyName}'s Team</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #374151;">Hi there!</p>
          <p style="font-size: 16px; line-height: 1.6; color: #374151;">
            <strong>${inviterName}</strong> has invited you to join <strong>${companyName}</strong> as a <strong>${role}</strong> on EventFlow.
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #374151;">
            EventFlow is a comprehensive event management platform that helps teams manage events, track song requests, handle drink orders, and much more.
          </p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${inviteLink}" style="
            display: inline-block;
            padding: 15px 30px;
            background: linear-gradient(135deg, #8B5CF6, #3B82F6);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 4px 6px rgba(139, 92, 246, 0.3);
          ">Accept Invitation</a>
        </div>

        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #92400e; margin-top: 0;">What you'll get as a ${role}:</h3>
          <ul style="color: #92400e; margin: 0; padding-left: 20px;">
            ${getRoleFeatures(role)}
          </ul>
        </div>

        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">
            If you didn't expect this invitation, you can safely ignore this email.
          </p>
          <p style="color: #6b7280; font-size: 14px; margin: 5px 0 0 0;">
            This invitation will expire in 7 days.
          </p>
        </div>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
        <p style="color: #64748b; font-size: 14px; text-align: center;">Best regards,<br>The EventFlow Team</p>
      </div>
    `,
    text: `You're invited to join ${companyName}'s team on EventFlow!\n\nHi there!\n\n${inviterName} has invited you to join ${companyName} as a ${role} on EventFlow.\n\nEventFlow is a comprehensive event management platform that helps teams manage events, track song requests, handle drink orders, and much more.\n\nAccept your invitation: ${inviteLink}\n\nIf you didn't expect this invitation, you can safely ignore this email.\nThis invitation will expire in 7 days.\n\nBest regards,\nThe EventFlow Team`,
  }),
};
