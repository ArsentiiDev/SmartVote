// import { emailHtml, mailOptions, transporter } from "@/nodemailer";
// import { NextApiRequest, NextApiResponse } from "next";

// const handler = async (req:NextApiRequest, res:NextApiResponse) => {
//     if (req.method === "POST") {  
//       try {
//         await transporter.sendMail({
//           ...mailOptions,
//           html: emailHtml
//         });
//         return res.status(200).json({ success: true });
//       } catch (err: any) {
//         console.log(err);
//         return res.status(400).json({ message: err.message });
//       }
//     }
//     return res.status(400).json({ message: "Bad request" });
//   };
//   export default handler;