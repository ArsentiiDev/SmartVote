import mongoose from 'mongoose';
const ObjectSchema = new mongoose.Schema({
  title: String,
  description: String,
});

export default ObjectSchema;