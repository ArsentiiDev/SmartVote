import mongoose from 'mongoose';

const Schema = mongoose.Schema

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  hashedPassword: {
    type: String,
    required: true,
    minLength: 5,
  },
  image: {
    type: String,
  }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User
