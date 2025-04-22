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
exports.syncBooksToElasticsearch = void 0;
const book_1 = __importDefault(require("../models/book"));
const elasticsearch_1 = __importDefault(require("../config/elasticsearch"));
// Fonction pour synchroniser les livres de MongoDB vers Elasticsearch
const syncBooksToElasticsearch = () => __awaiter(void 0, void 0, void 0, function* () {
    const INDEX_NAME = 'books';
    try {
        console.log('🔄 Synchronisation des livres vers Elasticsearch...');
        // 1. Récupérer tous les livres depuis MongoDB
        const books = yield book_1.default.find({});
        console.log(`📚 ${books.length} livres trouvés dans MongoDB`);
        if (books.length === 0) {
            console.log('⚠️ Aucun livre à synchroniser');
            return true; // Retourne true car ce n'est pas une erreur
        }
        // 2. Préparer les opérations en bulk en respectant la structure exacte du modèle Book
        const operations = books.flatMap(book => [
            { index: { _index: INDEX_NAME, _id: book._id.toString() } },
            {
                id: book._id.toString(),
                title: book.title,
                author: book.author,
                isbn: book.isbn,
                price: book.price,
                image: book.image,
                description: book.description
            }
        ]);
        // 3. Exécuter l'opération bulk
        const response = yield elasticsearch_1.default.bulk({
            refresh: true, // Rafraîchir l'index immédiatement
            operations
        });
        if (response.errors) {
            console.error('❌ Erreurs lors de la synchronisation:', response.errors);
            return false;
        }
        console.log(`✅ ${books.length} livres synchronisés avec Elasticsearch`);
        return true;
    }
    catch (error) {
        console.error('❌ Erreur lors de la synchronisation des livres:', error);
        return false;
    }
});
exports.syncBooksToElasticsearch = syncBooksToElasticsearch;
exports.default = exports.syncBooksToElasticsearch;
