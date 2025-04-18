import Basket from "../models/basket";
import mongoose from "mongoose";
import Book from "../models/book";

export default async function seedBaskets() {
  try {
    console.log("🧹 Suppression des paniers existants...");
    await Basket.deleteMany({});
    console.log("✅ Paniers existants supprimés");

    // Créer un panier vide
    console.log("📝 Création du panier vide...");
    await Basket.create({
      empty: true,
      bookNumber: 0,
      totalPrice: 0,
      books: [],
    });
    console.log("✅ Panier vide créé.");

    // Récupérer les livres existants
    console.log("🔍 Recherche des livres existants...");
    const books = await Book.find({}).limit(5);
    console.log(`📚 ${books.length} livres trouvés:`);
    books.forEach((book, index) => {
      console.log(`   - Livre ${index + 1}: ${book.title} (ID: ${book._id})`);
    });

    if (books.length < 5) {
      console.log("❌ ERREUR: Pas assez de livres trouvés pour créer un panier plein.");
      console.log("⚠️ Vérifiez que les livres ont bien été ajoutés à la base de données.");
      console.log("💡 Exécutez d'abord: npm run seed:books");
      return;
    }

    // Puis créer le panier avec ces IDs réels
    console.log("📝 Création du panier plein...");
    const testBasket = await Basket.create({
      empty: false,
      bookNumber: 8, // 2+1+3+1+1 = 8 livres au total
      totalPrice: 275, // (2*35) + (1*30) + (3*25) + (1*28) + (1*32) = 275€
      books: [
        { bookId: books[0]._id, quantity: 2 },  // 2 exemplaires du livre 1
        { bookId: books[1]._id, quantity: 1 },  // 1 exemplaire du livre 2
        { bookId: books[2]._id, quantity: 3 },  // 3 exemplaires du livre 3
        { bookId: books[3]._id, quantity: 1 },  // 1 exemplaire du livre 4
        { bookId: books[4]._id, quantity: 1 },  // 1 exemplaire du livre 5
      ],
    });
    console.log("✅ Panier plein créé avec succès!");
    console.log(`🧾 Détails du panier plein:`);
    console.log(`   - ID: ${testBasket._id}`);
    console.log(`   - Nombre d'articles: ${testBasket.bookNumber}`);
    console.log(`   - Prix total: ${testBasket.totalPrice}€`);
    console.log(`   - Livres: ${testBasket.books.length} différents`);
  } catch (error) {
    console.error("❌ ERREUR lors de la création des paniers:");
    console.error(error);
  }
}
