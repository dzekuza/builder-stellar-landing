import { Response } from "express";
import { prisma } from "../lib/prisma";
import { sendEmail, emailTemplates } from "../lib/email";
import { AuthenticatedRequest } from "../lib/auth";

// Get team members for a company
export const getTeamMembers = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Only company accounts can manage team members
    if (userRole !== "COMPANY") {
      return res.status(403).json({
        error: "Access denied. Only company accounts can manage team members.",
      });
    }

    // For now, return empty array since we don't have team management structure in the schema yet
    // In a real implementation, you would:
    // 1. Add a Company model to the schema
    // 2. Add relationships between Company and User
    // 3. Add team member invitations/management

    return res.json({ members: [] });
  } catch (error) {
    console.error("Error fetching team members:", error);
    return res.status(500).json({ error: "Failed to fetch team members" });
  }
};

// Invite a team member
export const inviteTeamMember = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const { email, role, message } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Only company accounts can invite team members
    if (userRole !== "COMPANY") {
      return res.status(403).json({
        error: "Access denied. Only company accounts can invite team members.",
      });
    }

    if (!email || !role) {
      return res.status(400).json({ error: "Email and role are required" });
    }

    // Validate role
    const validRoles = ["DJ", "BARISTA", "HOST"];
    if (!validRoles.includes(role.toUpperCase())) {
      return res
        .status(400)
        .json({ error: "Invalid role. Must be DJ, BARISTA, or HOST" });
    }

    // Get company user details
    const companyUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!companyUser) {
      return res.status(404).json({ error: "Company user not found" });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    try {
      // Send invitation email
      const template = emailTemplates.teamInvitation(
        companyUser.name,
        `${companyUser.name}'s EventFlow Team`,
        role.toUpperCase(),
        `${process.env.CLIENT_URL || "https://eventflow.app"}/register?invite=${email}&role=${role.toUpperCase()}`,
      );

      await sendEmail({
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      // In a real implementation, you would create a team invitation record here
      // For now, just return success

      return res.json({
        success: true,
        message: `Invitation sent to ${email} successfully`,
      });
    } catch (emailError) {
      console.error("Error sending invitation email:", emailError);
      return res.status(500).json({ error: "Failed to send invitation email" });
    }
  } catch (error) {
    console.error("Error inviting team member:", error);
    return res.status(500).json({ error: "Failed to invite team member" });
  }
};

// Remove a team member
export const removeTeamMember = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const { memberId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Only company accounts can remove team members
    if (userRole !== "COMPANY") {
      return res.status(403).json({
        error: "Access denied. Only company accounts can manage team members.",
      });
    }

    if (!memberId) {
      return res.status(400).json({ error: "Member ID is required" });
    }

    // In a real implementation, you would:
    // 1. Verify the member belongs to the company
    // 2. Remove the team member relationship
    // 3. Optionally deactivate the user account

    // For now, just return success
    return res.json({
      success: true,
      message: "Team member removed successfully",
    });
  } catch (error) {
    console.error("Error removing team member:", error);
    return res.status(500).json({ error: "Failed to remove team member" });
  }
};
