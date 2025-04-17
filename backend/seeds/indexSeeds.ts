import mongoose from "mongoose";
import seedBooks from "./booksSeeds";
import seedBaskets from "./basketSeeds";

const MONGO_URI = "mongodb://127.0.0.1:27017/henri-potier";

async function seedAll() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("🔌 Connecté à MongoDB");

    await seedBooks();
    await seedBaskets();

    await mongoose.disconnect();
    console.log("✅ Seed terminé.");
  } catch (error) {
    console.error("❌ Erreur dans le seed :", error);
  }
}

seedAll();
