import Book from '../models/book';
import elasticClient from '../config/elasticsearch';

// Fonction pour synchroniser les livres de MongoDB vers Elasticsearch
export const syncBooksToElasticsearch = async (): Promise<boolean> => {
  const INDEX_NAME = 'books';

  try {
    console.log('🔄 Synchronisation des livres vers Elasticsearch...');

    // 1. Récupérer tous les livres depuis MongoDB
    const books = await Book.find({});
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
    const response = await elasticClient.bulk({
      refresh: true, // Rafraîchir l'index immédiatement
      operations
    });

    if (response.errors) {
      console.error('❌ Erreurs lors de la synchronisation:', response.errors);
      return false;
    }

    console.log(`✅ ${books.length} livres synchronisés avec Elasticsearch`);
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la synchronisation des livres:', error);
    return false;
  }
};

export default syncBooksToElasticsearch;
