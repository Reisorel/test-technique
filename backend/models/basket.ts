import mongoose, { Schema, Document, Types } from "mongoose";

// Déclaration interface typescript
export interface Ibasket extends Document {
  empty: boolean;
  bookNumber: number;
  totalPrice: number;
  books: {
    bookId: Types.ObjectId;
    quantity: number;
  }[];
}

//Schéma
const basketSchema: Schema<Ibasket> = new Schema(
  {
    empty: {
      type: Boolean,
      required: true,
    },
    bookNumber: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    books: [
      {
        bookId: {
          type: Schema.Types.ObjectId,
          ref: "Book", // doit matcher le nom de ton modèle `Book`
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Export
const Basket = mongoose.model<Ibasket>("basket", basketSchema);
export default Basket;
