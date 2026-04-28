import nodemailer from "nodemailer"
import { User } from "@prisma/client"
import jwt from "jsonwebtoken"

/* ======================================================
   SMTP TRANSPORT
====================================================== */

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_EMAIL, // ✅ move to env
    pass: process.env.GMAIL_SERVER_APP_PASSWORD!,
  },
})

/* ======================================================
   BASE EMAIL TEMPLATE
====================================================== */

function baseTemplate(content: string): string {
  return `
  <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f9fafb;padding:24px;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;padding:32px;color:#111827;">
      
      <h1 style="margin-bottom:20px;color:#7c3aed;">Quoteshack</h1>

      ${content}  

      <hr style="margin:32px 0;border:none;border-top:1px solid #e5e7eb;" />

      <p style="font-size:12px;color:#9ca3af;">
        All rights reserved © ${new Date().getFullYear()} Quoteshack. 
      </p>

      <p style="font-size:12px;color:#9ca3af;">
        Need help? Contact us at 
        <a href="mailto:admin@meetquoteshack.com" style="color:#7c3aed;text-decoration:none;">
          admin@meetquoteshack.com
        </a>
      </p>

      <p style="font-size:12px;color:#9ca3af;">
        This is an automated message. Please do not reply.
      </p>
    </div>
  </div>
  `
}

/* ======================================================
   SEND HELPER
====================================================== */

async function sendMail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  return transporter.sendMail({
    from: '"Quoteshack" <no-reply@loanplatform.com>',
    to,
    subject,
    html,
  })
}

export async function sendPasswordResetEmail(user: User) {
  // ✅ create token (simpler version for your app)
  const token = jwt.sign(
    { id: user.id, purpose: "password_reset" },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" }
  )

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/lender/resetpassword?token=${token}`

  const html = baseTemplate(`
    <h2>Hi ${user.name || "User"},</h2>

    <p>
      We received a request to reset your password for your lender account.
    </p>

    <div style="margin:24px 0;">
      <a href="${resetUrl}" target="_blank"
        style="background:#7c3aed;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;">
        Reset Password
      </a>
    </div>

    <p style="font-size:14px;">
      This link will expire in <strong>15 minutes</strong>.
    </p>

    <p style="font-size:14px;">
      If you did not request a password reset, you can safely ignore this email.
    </p>

    <p style="font-size:14px;margin-top:16px;">
      Or copy and paste this link into your browser:
    </p>

    <p style="word-break:break-all;color:#7c3aed;">
      ${resetUrl}
    </p>
  `)

  await sendMail({
    to: user.email!,
    subject: "Reset your password",
    html,
  })
}

export async function sendNewApplicationReceivedEmail({
  receiverType,
  lenderEmail,
  agentEmail,
  applicantName,
  loanType,
  amount,
  applicationId,
}: {
  receiverType: "AGENT" | "LENDER"
  lenderEmail?: string
  agentEmail?: string
  applicantName: string
  loanType: string
  amount: string
  applicationId: string
}) {
  const recipient = receiverType === "AGENT" ? agentEmail : lenderEmail

  if (!recipient) {
    throw new Error("No recipient email provided")
  }

  const dashboardPath =
    receiverType === "AGENT"
      ? `/agent/dashboard/${applicationId}`
      : `/lender/dashboard/${applicationId}`

  const viewUrl = `${process.env.NEXT_PUBLIC_APP_URL}${dashboardPath}`

  const html = baseTemplate(`
    <h2>New Loan Application Received</h2>

    <p>
      A new application has been submitted by <strong>${applicantName}</strong>.
    </p>

    <ul style="font-size:14px;line-height:1.6;">
      <li><strong>Loan Type:</strong> ${loanType}</li>
      <li><strong>Requested Amount:</strong> $${amount}</li>
    </ul>

    <div style="margin:24px 0;">
      <a href="${viewUrl}"
        style="background:#7c3aed;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;">
        View Application
      </a>
    </div>
  `)

  await sendMail({
    to: recipient,
    subject: "New Loan Application Received",
    html,
  })
}

export async function sendApplicationStatusEmail({
  to,
  name,
  status,
}: {
  to: string
  name: string
  status: string
}) {
  const html = baseTemplate(`
    <h2>Hi ${name || "User"},</h2>

    <p>Your loan application status has been updated.</p>

    <div style="margin:20px 0;">
      <strong>Status:</strong> ${status}
    </div>

    <p>
      Please log in to your account to view more details.
    </p>
  `)

  await sendMail({
    to,
    subject: `Application ${status}`,
    html,
  })
}

export async function sendApplicationStatusEmailRejected({
  to,
  name,
  status,
}: {
  to: string
  name: string
  status: string
}) {
  const html = baseTemplate(`
    <h2>Hi ${name || "User"},</h2>

    <p>Your loan application status has been rejected.</p>

    <div style="margin:20px 0;">
      <strong>Status:</strong> ${status}
    </div>

    <p>
      Please log in to your account to view more details.
    </p>
  `)

  await sendMail({
    to,
    subject: `Application ${status}`,
    html,
  })
}

export async function sendChatStartedEmail({
  to,
  name,
  applicationId,
}: {
  to: string
  name: string
  applicationId: string
}) {
  const html = baseTemplate(`
    <h2>Hi ${name},</h2>

    <p>Good news! A lender has started a chat with you regarding your loan application.</p>

    <div style="margin:24px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/applications/${applicationId}"
        style="background:#7c3aed;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;">
        Open Chat
      </a>
    </div>
  `)

  await sendMail({
    to,
    subject: "Lender started chat with you 💬",
    html,
  })
}

export async function sendNewMessageEmail({
  to,
  name,
  applicationId,
  message,
}: {
  to: string
  name: string
  applicationId: string
  message: string
}) {
  const html = baseTemplate(`
    <h2>Hi ${name},</h2>

    <p>You have received a new message from your lender.</p>

    <div style="margin:16px 0;padding:12px;background:#f3f4f6;border-radius:8px;">
      ${message}
    </div>

    <div style="margin:24px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/applications/${applicationId}"
        style="background:#7c3aed;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;">
        View Message
      </a>
    </div>
  `)

  await sendMail({
    to,
    subject: "New message from lender 💬",
    html,
  })
}

export async function sendDocumentRequestEmail({
  to,
  name,
  applicationId,
  documents,
}: {
  to: string
  name: string
  applicationId: string
  documents: string[]
}) {
  const docList = documents.map((d) => `<li>${d}</li>`).join("")

  const html = baseTemplate(`
    <h2>Hi ${name},</h2>

    <p>Your lender has requested additional documents for your loan application.</p>

    <p><strong>Requested Documents:</strong></p>

    <ul style="line-height:1.6;">
      ${docList}
    </ul>

    <div style="margin:20px 0;padding:16px;background:#f9fafb;border-radius:10px;">
      <p style="font-weight:600;margin-bottom:8px;">How to upload documents:</p>
      <ol style="padding-left:18px;line-height:1.6;font-size:14px;">
        <li>Go to your application dashboard</li>
        <li>Open your loan application</li>
        <li>Check the <strong>“Required Documents”</strong> section</li>
        <li>Upload the requested documents</li>
      </ol>
    </div>

    <div style="margin:24px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/applications/${applicationId}"
        style="background:#7c3aed;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;">
        Upload Documents
      </a>
    </div>

    <p>Please upload them as soon as possible to avoid delays in processing your application.</p>
  `)

  await sendMail({
    to,
    subject: "Documents Required for Your Loan Application 📄",
    html,
  })
}

export async function sendDocumentRejectedEmail({
  to,
  name,
  documentName,
  applicationId,
}: {
  to: string
  name: string
  documentName: string
  applicationId: string
}) {
  const html = baseTemplate(`
    <h2>Hi ${name},</h2>

    <p>Your document has been rejected.</p>

    <div style="margin:16px 0;">
      <strong>Document:</strong> ${documentName}
    </div>

    <p>Please upload a valid document to continue your application.</p>

    <div style="margin:24px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/applications/${applicationId}"
        style="background:#7c3aed;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;">
        Upload Document
      </a>
    </div>
  `)

  await sendMail({
    to,
    subject: "Document Rejected ❌",
    html,
  })
}

export async function sendDocumentApprovedEmail({
  to,
  name,
  documentName,
  applicationId,
}: {
  to: string
  name: string
  documentName: string
  applicationId: string
}) {
  const html = baseTemplate(`
    <h2>Hi ${name},</h2>

    <p>Your document has been successfully approved ✅</p>

    <div style="margin:16px 0;">
      <strong>Document:</strong> ${documentName}
    </div>

    <p>No further action is required at this moment.</p>

    <div style="margin:24px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/applications/${applicationId}"
        style="background:#7c3aed;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;">
        View Application
      </a>
    </div>
  `)

  await sendMail({
    to,
    subject: "Document Approved ✅",
    html,
  })
}
