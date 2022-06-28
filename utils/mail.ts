import nodemailer from 'nodemailer';

export async function sendMail(
  recipient: string,
  subject: string,
  message: string
) {
  const transporter = nodemailer.createTransport({
    host: 'outlook.office365.com',
    port: 587,
    secure: false,
    auth: {
      user: 'mail@zeromoneyteam.com',
      pass: process.env.MAIL_PASSWORD!,
    },
    tls: {
      ciphers: 'SSLv3',
    },
  });

  const mail = await transporter.sendMail({
    from: '"ZeroMoneyTeam" <mail@zeromoneyteam.com>',
    to: recipient,
    subject: subject,
    text: message,
  });
}
