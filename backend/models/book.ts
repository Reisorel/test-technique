import mongoose, {Schema, Document } from "mongoose"

// Déclaration interface typescript
export interface Ibook extends Document {
  title: string;
  author: string;
  isbn: number;
  price: number;
  image: string;
  description: string;
}

//Schéma
const bookSchema: Schema<Ibook> = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    isbn: {
      type: Number,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Export
const Book = mongoose.model<Ibook>("book", bookSchema)
export default Book;
