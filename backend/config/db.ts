import mongoose from "mongoose";

const uri:string = "mongodb://127.0.0.1:27017/henri-potier"

// Connexion à la base de données MongoDB
const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(uri);
    console.log(`✅ MongoDB connected in ${uri} localhost (127.0.0.1)`);
  } catch (error: any) {
    console.error("❌ MongoDB connexion impossible");
    process.exit(1);
  }
};

export default connectDB;
