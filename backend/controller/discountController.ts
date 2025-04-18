import { Request, Response } from "express";
import { calculateBestDiscount, Offer } from "../utils/discount"; // Importer le type Offer
import Basket from "../models/basket";
import Book from "../models/book";

// Offres commerciales fixes - typées avec le même type Offer du fichier discount.ts
const COMMERCIAL_OFFERS: { offers: Offer[] } = {
  offers: [
    { type: "percentage", value: 5 },
    { type: "minus", value: 15 },
    { type: "slice", sliceValue: 100, value: 12 }
  ]
};

const discountController = {
  /**
   * Récupère le panier et applique les remises disponibles
   */
  getDiscountedBasket: async (req: Request, res: Response): Promise<void> => {
    try {
      const basketId = req.params.id;

      if (!basketId) {
        res.status(400).json({ error: "ID de panier requis" });
        return;
      }

      // Récupérer le panier directement depuis le modèle
      const basket = await Basket.findById(basketId);

      if (!basket || !basket.books || basket.books.length === 0) {
        res.status(404).json({ error: "Panier non trouvé ou vide" });
        return;
      }

      // Récupérer les détails complets des livres
      const booksDetails = [];
      let totalPrice = 0;

      for (const item of basket.books) {
        const book = await Book.findById(item.bookId);
        if (book) {
          const bookWithQuantity = {
            id: book.id,
            isbn: book.isbn,
            title: book.title,
            price: book.price,
            image: book.image,
            quantity: item.quantity
          };

          booksDetails.push(bookWithQuantity);
          totalPrice += book.price * item.quantity;
        }
      }

      // Utiliser les offres commerciales prédéfinies
      const { offers } = COMMERCIAL_OFFERS;

      // Adapter les livres pour la fonction de calcul de remise
      const booksForDiscount = booksDetails.flatMap(book =>
        Array(book.quantity).fill({
          id: book.id,
          isbn: book.isbn,
          title: book.title,
          price: book.price,
          // Pas besoin d'inclure image car le type Book dans discount.ts l'appelle cover et le rend optionnel
        })
      );

      // Calculer le prix avec remise
      const discountResult = calculateBestDiscount(booksForDiscount, offers);

      // Retourner le résultat
      res.status(200).json({
        basketId,
        books: booksDetails,
        totalPrice,
        discountedPrice: discountResult.finalPrice,
        discount: discountResult.discount,
        offers,
        selectedOffer: discountResult.selectedOffer,
        offerDetails: discountResult.offerDetails
      });
    } catch (error: any) {
      console.error("Erreur lors du calcul de la remise:", error);
      res.status(500).json({ error: "Impossible de calculer la remise" });
    }
  }
};

export default discountController;
