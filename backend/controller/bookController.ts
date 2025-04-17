import { Request, Response } from "express";
import Book from "../models/book";

//Get api/books
const getAllBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const books = await Book.find();
    console.log("📦Books fetched");

    if (books.length === 0) {
      res.status(200).json({ message: "Books list is actually empty" });
      return;
    }

    res.status(200).json(books);
  } catch (error: any) {
    res.status(500).json({ message: "Error during books research", error });
  }
};


export default {
  getAllBooks
};
