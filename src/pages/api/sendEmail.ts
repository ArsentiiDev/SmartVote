// pages/api/sendEmail.ts
import { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer';

const email = process.env.EMAIL;
const pass = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: email,
    pass,
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { votingId, html } = req.body;
  

  const mailOptions = {
    from: email,
    subject: 'Voting',
    to: email,
    html: html,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      //console.log(`Error occurred: ${err.message}`);
      res.status(500).json({ message: 'Error sending email' });
    } else {
      //console.log(`Email sent: ${info.response}`);
      res.status(200).json({ message: 'Email sent successfully' });
    }
  });
  res.status(200)
}
