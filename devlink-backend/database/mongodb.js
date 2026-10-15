import mongoose from "mongoose";
import dns from "dns";

// Fix for Windows / ISP DNS refusing SRV queries (ECONNREFUSED)
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
  // Silent fallback in environments where setServers is restricted
}

let cachedConnection = null;

const connectToDatabase = async () => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      "MONGODB_URI is not set in environment variables. Please set MONGODB_URI (e.g., from MongoDB Atlas) in your .env file."
    );
  }

  try {
    cachedConnection = await mongoose.connect(uri, {
      bufferCommands: false,
    });

    console.log("MongoDB connection successful!");
    return cachedConnection;
  } catch (error) {
    cachedConnection = null;
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

export default connectToDatabase;