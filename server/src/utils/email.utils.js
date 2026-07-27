import nodemailer from 'nodemailer';

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendVerificationEmail(email, firstName, token) {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
  const transporter = createTransporter();

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'Smart Society Hub <noreply@smartsocietyhub.com>',
    to: email,
    subject: 'Verify Your Email — Smart Society Hub',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Smart Society Hub</h1>
        </div>
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px;">
          <h2 style="color: #1f2937;">Hello, ${firstName}! 👋</h2>
          <p style="color: #6b7280;">Please verify your email address to complete your registration.</p>
          <a href="${verifyUrl}" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 20px 0;">
            Verify Email
          </a>
          <p style="color: #9ca3af; font-size: 14px;">This link expires in 24 hours. If you didn't create an account, please ignore this email.</p>
        </div>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(email, firstName, token) {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  const transporter = createTransporter();

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'Smart Society Hub <noreply@smartsocietyhub.com>',
    to: email,
    subject: 'Reset Your Password — Smart Society Hub',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Smart Society Hub</h1>
        </div>
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px;">
          <h2 style="color: #1f2937;">Password Reset Request 🔐</h2>
          <p style="color: #6b7280;">Hi ${firstName}, we received a request to reset your password.</p>
          <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 20px 0;">
            Reset Password
          </a>
          <p style="color: #9ca3af; font-size: 14px;">This link expires in 1 hour. If you didn't request a password reset, please ignore this email.</p>
        </div>
      </div>
    `,
  });
}

export async function sendWelcomeEmail(email, firstName, role) {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'Smart Society Hub <noreply@smartsocietyhub.com>',
    to: email,
    subject: 'Welcome to Smart Society Hub! 🏠',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Smart Society Hub</h1>
        </div>
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px;">
          <h2 style="color: #1f2937;">Welcome aboard, ${firstName}! 🎉</h2>
          <p style="color: #6b7280;">Your account has been created with the role: <strong>${role}</strong>.</p>
          <p style="color: #6b7280;">You can now log in to Smart Society Hub and enjoy all the features of your smart community.</p>
          <a href="${process.env.CLIENT_URL}/login" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 20px 0;">
            Go to Dashboard
          </a>
        </div>
      </div>
    `,
  });
}
