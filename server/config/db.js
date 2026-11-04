import mongoose from "mongoose";

// Shared by every request. Cleared on failure so the next request retries,
// instead of the whole server exiting (which Vercel shows as a 500 crash).
let connecting = null;

const connectDB = () => {
  if (mongoose.connection.readyState === 1) return Promise.resolve();

  if (!connecting) {
    connecting = mongoose.connect(process.env.MONGO_URI).then(
      () => console.log("✅ MongoDB Connected"),
      (error) => {
        connecting = null;
        console.error(error);
        throw error;
      }
    );
  }

  return connecting;
};

export default connectDB;
