import nodemailer from 'nodemailer';

export async function sendMail(
  recipient: string,
  subject: string,
  message: string
) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'zeromoneyteam@gmail.com',
      pass: process.env.MAIL_PASSWORD!,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mail = await transporter.sendMail({
    from: '"ZeroMoneyTeam" <zeromoneyteam@gmail.com>',
    to: recipient,
    subject: subject,
    text: message,
  });
}
