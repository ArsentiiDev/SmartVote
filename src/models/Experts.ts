import mongoose from "mongoose";

const ExpertSchema = new mongoose.Schema({
  name: String,
  email: String,
  status: String,
});
export default ExpertSchema
