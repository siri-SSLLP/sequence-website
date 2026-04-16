import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  isAdmin: Boolean,
});

export default mongoose.model("UserSequence", userSchema);