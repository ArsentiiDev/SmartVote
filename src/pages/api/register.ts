import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/dbConnect";
import User from "../../models/User";
import bcrypt from "bcrypt";
import { z } from "zod";
import { IErrorResponse, ISuccessResponse } from "@/Types/Interfaces";

const usernameSchema = z.string().min(3);
const emailSchema = z.string().email();
const passwordSchema = z.string().min(5);

const validateForm = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    emailSchema.parse(email);

    await dbConnect();
    const emailUser = await User.findOne({ email: email });

    if (emailUser) {
      throw new Error("Email already exists");
    }

    passwordSchema.parse(password);

    return null;
  } catch (error: any) {
    return { error: error.message };
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IErrorResponse | ISuccessResponse<any>>
) {
  if (req.method !== "POST") {
    return res
      .status(400)
      .json({success: false,  message: "This API call only accepts POST methods" });
  }

  const { username, email, password } = req.body;

  console.log(username, email)

  const errorMessage = await validateForm(username, email, password);
  if (errorMessage) {
    return res.status(400).json({success: false, message: errorMessage as any});
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = new User({
    username: username,
    email,
    hashedPassword,
    votings: []
  });

  try {
    await newUser.save();
    res.status(200).json({ success: true,  message: "Successfully created new User: ", object: {email, password} });
  } catch (error) {
    res.status(400).json( {success: false,  message: "Error on '/api/register': " + error });
  }
}
