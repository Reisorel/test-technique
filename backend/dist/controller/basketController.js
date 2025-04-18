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
const basket_1 = __importDefault(require("../models/basket"));
const book_1 = __importDefault(require("../models/book"));
//Get api/basket
const getAllBaskets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const baskets = yield basket_1.default.find();
        console.log("📦baskets fetched");
        if (baskets.length === 0) {
            res.status(200).json({ message: "Baskets list is actually empty" });
            return;
        }
        res.status(200).json(baskets);
    }
    catch (error) {
        res.status(500).json({ message: "Error during basket research", error });
    }
});
//Get api/books/:id
const getBasketById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const basket = yield basket_1.default.findById(req.params.id);
        if (!basket) {
            res.status(404).json({ message: "Basket not found" });
            return;
        }
        res.status(200).json(basket);
    }
    catch (error) {
        res.status(500).json({ message: "Error during basket research" });
    }
});
// Ajoutez ces logs pour suivre le cheminement de la requête
const addNewBookToBasket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("➡️ Requête POST reçue pour ajouter un livre au panier");
    console.log("🔍 Params:", req.params);
    console.log("📦 Body:", req.body);
    try {
        // 1. Récupère le panier
        console.log("🔍 Recherche du panier avec ID:", req.params.id);
        const basket = yield basket_1.default.findById(req.params.id);
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
        const bookExists = yield book_1.default.findById(bookId);
        if (!bookExists) {
            console.log("❌ Livre non trouvé avec ID:", bookId);
            res.status(404).json({ message: "Book not found" });
            return;
        }
        console.log("✅ Livre trouvé:", bookExists.title);
        // 4. Cherche si le livre est déjà présent dans le panier
        console.log("🔍 Vérification si le livre est déjà dans le panier");
        const existingBook = basket.books.find((book) => book.bookId.toString() === bookId);
        // 5. Incrémente ou ajoute le livre
        if (existingBook) {
            console.log("📈 Incrémentation de la quantité pour un livre existant");
            existingBook.quantity += quantity;
        }
        else {
            console.log("➕ Ajout d'un nouveau livre au panier");
            basket.books.push({ bookId, quantity });
        }
        // 6. Recalcule le bookNumber
        basket.bookNumber = basket.books.reduce((sum, book) => sum + book.quantity, 0);
        console.log("🧮 Nouveau nombre de livres:", basket.bookNumber);
        // Recalcule le totalPrice
        let total = 0;
        for (const item of basket.books) {
            const book = yield book_1.default.findById(item.bookId);
            if (book) {
                total += book.price * item.quantity;
            }
        }
        basket.totalPrice = total;
        console.log("💰 Nouveau prix total:", basket.totalPrice);
        // 7. Sauvegarde et renvoie
        console.log("💾 Sauvegarde du panier mis à jour");
        yield basket.save();
        console.log("✅ Panier sauvegardé avec succès");
        res.status(200).json({ message: "Book added to basket", basket });
    }
    catch (error) {
        console.error("❌ Erreur lors de l'ajout du livre au panier:", error);
        res.status(500).json({
            message: "Error adding book to basket",
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});
const deleteBookFromBasket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1. Récupère le panier
        const basket = yield basket_1.default.findById(req.params.id);
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
        const index = basket.books.findIndex((book) => book.bookId.toString() === bookId);
        if (index === -1) {
            res.status(404).json({ message: "Book not found in basket" });
            return;
        }
        // 4. Supprime le livre du panier
        basket.books.splice(index, 1);
        // 5. Recalcule bookNumber
        basket.bookNumber = basket.books.reduce((sum, book) => sum + book.quantity, 0);
        // 6. Recalcule totalPrice
        let total = 0;
        for (const item of basket.books) {
            const book = yield book_1.default.findById(item.bookId);
            if (book) {
                total += book.price * item.quantity;
            }
        }
        basket.totalPrice = total;
        // 7. Sauvegarde et retourne le panier mis à jour
        yield basket.save();
        res.status(200).json({ message: "Book removed from basket", basket });
    }
    catch (error) {
        res.status(500).json({ message: "Error removing book from basket", error });
    }
});
exports.default = {
    getAllBaskets,
    getBasketById,
    addNewBookToBasket,
    deleteBookFromBasket,
};
