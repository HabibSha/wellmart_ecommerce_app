import mongoose from "mongoose";
import { mongodbUri } from "../secret";

const connectDatabase = async (options = {}): Promise<void> => {
  try {
    await mongoose.connect(mongodbUri, options);
    console.log("Database connected successfully");

    // Attach event listeners to mongoose.connection
    mongoose.connection.on("error", (error: Error) => {
      console.error("Database connection error: ", error.message);
    });

    mongoose.connection.on("connected", () => {
      console.log("Mongoose connected to the database");
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose disconnected from the database");
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Failed to connect to the database:", error.message);
    } else {
      console.log("Failed to connect to the database:", error);
    }
  }
};

export default connectDatabase;
