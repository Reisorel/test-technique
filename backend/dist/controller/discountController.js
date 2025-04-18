"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discount_1 = require("../utils/discount"); // Importer le type Offer
const basket_1 = __importDefault(require("../models/basket"));
const book_1 = __importDefault(require("../models/book"));
// Offres commerciales fixes - typées avec le même type Offer du fichier discount.ts
const COMMERCIAL_OFFERS = {
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
    getDiscountedBasket: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const basketId = req.params.id;
            if (!basketId) {
                res.status(400).json({ error: "ID de panier requis" });
                return;
            }
            // Récupérer le panier directement depuis le modèle
            const basket = yield basket_1.default.findById(basketId);
            if (!basket || !basket.books || basket.books.length === 0) {
                res.status(404).json({ error: "Panier non trouvé ou vide" });
                return;
            }
            // Récupérer les détails complets des livres
            const booksDetails = [];
            let totalPrice = 0;
            for (const item of basket.books) {
                const book = yield book_1.default.findById(item.bookId);
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
            const booksForDiscount = booksDetails.flatMap(book => Array(book.quantity).fill({
                id: book.id,
                isbn: book.isbn,
                title: book.title,
                price: book.price,
                // Pas besoin d'inclure image car le type Book dans discount.ts l'appelle cover et le rend optionnel
            }));
            // Calculer le prix avec remise
            const discountResult = (0, discount_1.calculateBestDiscount)(booksForDiscount, offers);
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
        }
        catch (error) {
            console.error("Erreur lors du calcul de la remise:", error);
            res.status(500).json({ error: "Impossible de calculer la remise" });
        }
    })
};
exports.default = discountController;
