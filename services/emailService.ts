import nodemailer from "nodemailer";

class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    } as nodemailer.TransportOptions);
  }

  async sendVerificationEmail(email: string, token: string) {
    const message = `Please verify your email by clicking on the following link:\nURL: ${process.env.HTTP_SSL}://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/verify?token=${token}`;

    await this.transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
      to: email,
      subject: "Verify your email", // Subject line
      text: message,
    });
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const message = `You can reset your password by clicking on the following link:\nURL: ${process.env.HTTP_SSL}://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/reset-password?token=${token}`;

    await this.transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
      to: email,
      subject: "Password Reset",
      text: message,
    });
  }
}

export const emailService = new EmailService();
