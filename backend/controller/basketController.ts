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

// Ajoutez ces logs pour suivre le cheminement de la requête
const addNewBookToBasket = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("➡️ Requête POST reçue pour ajouter un livre au panier");
  console.log("🔍 Params:", req.params);
  console.log("📦 Body:", req.body);

  try {
    // 1. Récupère le panier
    console.log("🔍 Recherche du panier avec ID:", req.params.id);
    const basket = await Basket.findById(req.params.id);
    if (!basket) {
      console.log("❌ Panier non trouvé avec ID:", req.params.id);
      res.status(404).json({ message: "Basket not found" });
      return;
    }
    console.log("✅ Panier trouvé:", basket._id);

    // 2. Récupère les données du corps de la requête
    const { bookId, quantity } = req.body;
    if (!bookId || !quantity) {
      console.log("❌ Données manquantes:", { bookId, quantity });
      res.status(400).json({ message: "Book ID and quantity are required" });
      return;
    }
    console.log("📚 Données du livre:", { bookId, quantity });

    // 3. Vérifie que le livre existe
    console.log("🔍 Recherche du livre avec ID:", bookId);
    const bookExists = await Book.findById(bookId);
    if (!bookExists) {
      console.log("❌ Livre non trouvé avec ID:", bookId);
      res.status(404).json({ message: "Book not found" });
      return;
    }
    console.log("✅ Livre trouvé:", bookExists.title);

    // 4. Cherche si le livre est déjà présent dans le panier
    console.log("🔍 Vérification si le livre est déjà dans le panier");
    const existingBook = basket.books.find(
      (book) => book.bookId.toString() === bookId
    );

    // 5. Incrémente ou ajoute le livre
    if (existingBook) {
      console.log("📈 Incrémentation de la quantité pour un livre existant");
      existingBook.quantity += quantity;
    } else {
      console.log("➕ Ajout d'un nouveau livre au panier");
      basket.books.push({ bookId, quantity });
    }

    // 6. Recalcule le bookNumber
    basket.bookNumber = basket.books.reduce(
      (sum, book) => sum + book.quantity,
      0
    );
    console.log("🧮 Nouveau nombre de livres:", basket.bookNumber);

    // Recalcule le totalPrice
    let total = 0;
    for (const item of basket.books) {
      const book = await Book.findById(item.bookId);
      if (book) {
        total += book.price * item.quantity;
      }
    }
    basket.totalPrice = total;
    console.log("💰 Nouveau prix total:", basket.totalPrice);

    // 7. Sauvegarde et renvoie
    console.log("💾 Sauvegarde du panier mis à jour");
    await basket.save();
    console.log("✅ Panier sauvegardé avec succès");
    res.status(200).json({ message: "Book added to basket", basket });
  } catch (error: any) {
    console.error("❌ Erreur lors de l'ajout du livre au panier:", error);
    res.status(500).json({
      message: "Error adding book to basket",
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

const decreaseBookQuantity = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("➡️ FONCTION DECREASE APPELÉE");
  console.log("🔍 TOUS LES PARAMS:", req.params);

  try {
    // 1. Récupérer le panier
    const basket = await Basket.findById(req.params.id);
    if (!basket) {
      res.status(404).json({ message: "Basket not found" });
      return;
    }
    console.log("✅ Panier trouvé");

    // 2. Trouver l'index du livre dans le panier
    const bookId = req.params.bookId;
    const index = basket.books.findIndex(
      (book) => book.bookId.toString() === bookId
    );

    if (index === -1) {
      res.status(404).json({ message: "Book not found in basket" });
      return;
    }
    console.log("✅ Livre trouvé dans le panier");

    // 3. Décrémente la quantité ou supprime si quantité = 1
    if (basket.books[index].quantity > 1) {
      basket.books[index].quantity -= 1;
      console.log("📉 Quantité décrémentée à", basket.books[index].quantity);
    } else {
      basket.books.splice(index, 1);
      console.log("🗑️ Livre supprimé du panier car quantité = 1");
    }

    // 4. Recalculer les totaux
    basket.bookNumber = basket.books.reduce(
      (sum, book) => sum + book.quantity, 0
    );

    let total = 0;
    for (const item of basket.books) {
      const book = await Book.findById(item.bookId);
      if (book) {
        total += book.price * item.quantity;
      }
    }
    basket.totalPrice = total;
    console.log("💰 Prix total recalculé:", basket.totalPrice);

    // 5. Sauvegarder et renvoyer
    await basket.save();
    console.log("💾 Panier sauvegardé");

    res.status(200).json({
      message: "Book quantity decreased",
      basket
    });
  } catch (error: any) {
    console.error("❌ ERREUR:", error);
    res.status(500).json({
      message: "Error decreasing book quantity",
      error: error.message
    });
  }
};

export default {
  getAllBaskets,
  getBasketById,
  addNewBookToBasket,
  decreaseBookQuantity,
};
