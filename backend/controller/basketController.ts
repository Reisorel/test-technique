import { Request, Response } from "express";
import Basket from "../models/basket";
import Book from "../models/book";

//Get api/basket
const getAllBaskets = async (req: Request, res: Response): Promise<void> => {
  try {
    const baskets = await Basket.find();
    console.log("📦baskets fetched");

    if (baskets.length === 0) {
      res.status(200).json({ message: "Baskets list is actually empty" });
      return;
    }

    res.status(200).json(baskets);
  } catch (error: any) {
    res.status(500).json({ message: "Error during basket research", error });
  }
};

//Get api/books/:id
const getBasketById = async (req: Request, res: Response): Promise<void> => {
  try {
    const basket = await Basket.findById(req.params.id);
    if (!basket) {
      res.status(404).json({ message: "Basket not found" });
      return;
    }

    res.status(200).json(basket);
  } catch (error: any) {
    res.status(500).json({ message: "Error during basket research" });
  }
};

//Add new book to basket
const addNewBookToBasket = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // 1. Récupère le panier
    const basket = await Basket.findById(req.params.id);
    if (!basket) {
      res.status(404).json({ message: "Basket not found" });
      return;
    }

    // 2. Récupère les données du corps de la requête
    const { bookId, quantity } = req.body;
    if (!bookId || !quantity) {
      res.status(400).json({ message: "Book ID and quantity are required" });
      return;
    }

    // 3. Vérifie que le livre existe
    const bookExists = await Book.findById(bookId);
    if (!bookExists) {
      res.status(404).json({ message: "Book not found" });
      return;
    }

    // 4. Cherche si le livre est déjà présent dans le panier
    const existingBook = basket.books.find(
      (book) => book.bookId.toString() === bookId
    );

    // 5. Incrémente ou ajoute le livre
    if (existingBook) {
      existingBook.quantity += quantity;
    } else {
      basket.books.push({ bookId, quantity });
    }

    // 6. Recalcule le bookNumber
    basket.bookNumber = basket.books.reduce(
      (sum, book) => sum + book.quantity,
      0
    );

    // Recalcule le totalPrice
    let total = 0;
    for (const item of basket.books) {
      const book = await Book.findById(item.bookId);
      if (book) {
        total += book.price * item.quantity;
      }
    }
    basket.totalPrice = total;

    // 7. Sauvegarde et renvoie
    await basket.save();
    res.status(200).json({ message: "Book added to basket", basket });
  } catch (error: any) {
    res.status(500).json({ message: "Error adding book to basket", error });
  }
};

const deleteBookFromBasket = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // 1. Récupère le panier
    const basket = await Basket.findById(req.params.id);
    if (!basket) {
      res.status(404).json({ message: "Basket not found" });
      return;
    }

    // 2. Récupère le bookId à supprimer
    const { bookId } = req.body;
    if (!bookId) {
      res.status(400).json({ message: "Book ID is required" });
      return;
    }

    // 3. Vérifie si le livre est présent dans le panier
    const index = basket.books.findIndex(
      (book) => book.bookId.toString() === bookId
    );
    if (index === -1) {
      res.status(404).json({ message: "Book not found in basket" });
      return;
    }

    // 4. Supprime le livre du panier
    basket.books.splice(index, 1);

    // 5. Recalcule bookNumber
    basket.bookNumber = basket.books.reduce(
      (sum, book) => sum + book.quantity,
      0
    );

    // 6. Recalcule totalPrice
    let total = 0;
    for (const item of basket.books) {
      const book = await Book.findById(item.bookId);
      if (book) {
        total += book.price * item.quantity;
      }
    }
    basket.totalPrice = total;

    // 7. Sauvegarde et retourne le panier mis à jour
    await basket.save();
    res.status(200).json({ message: "Book removed from basket", basket });
  } catch (error: any) {
    res.status(500).json({ message: "Error removing book from basket", error });
  }
};

export default {
  getAllBaskets,
  getBasketById,
  addNewBookToBasket,
  deleteBookFromBasket,
};
