import { useState, useEffect } from 'react';
import './Shop.css'; // N'oubliez pas de créer ce fichier CSS pour les styles
import Modal from '../Modal/Modal';

interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: number;
  price: number;
  image: string;
  description: string;
}

interface CartMessage {
  message: string;
  type: 'success' | 'error';
}

export default function Shop() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<{ [key: string]: boolean }>({});
  const [cartMessage, setCartMessage] = useState<CartMessage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalBook, setModalBook] = useState<Book | null>(null);
  const basketId = '680745c147db4aad10d4c81c'; // L'ID que vous avez mentionné précédemment

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/shop/books');

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        setBooks(data);
      } catch (err) {
        console.error("Erreur lors de la récupération des livres:", err);
        setError("Impossible de charger les livres");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Fonction pour ajouter un livre au panier
  const addToCart = async (bookId: string) => {
    // Mettre à jour l'état pour afficher le spinner sur le bouton
    setAddingToCart(prev => ({ ...prev, [bookId]: true }));

    try {
      // Utiliser la route correcte: POST /:id
      const response = await fetch(`http://localhost:3000/api/shop/baskets/${basketId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookId: bookId,
          quantity: 1 // Par défaut, on ajoute un exemplaire
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      // Analyser la réponse JSON
      const data = await response.json();

      // Trouver le livre ajouté
      const addedBook = books.find(book => book._id === bookId);
      if (addedBook) {
        setModalBook(addedBook);
        setIsModalOpen(true);
      }

      // Ajouter ce console.log pour valider l'ajout
      console.log("✅ Livre ajouté avec succès:", {
        bookId: bookId,
        basketId: basketId,
        newBasket: data.basket // La réponse contient probablement le panier mis à jour
      });

      // Afficher un message de succès
      setCartMessage({ message: "Livre ajouté au panier !", type: 'success' });

      // Faire disparaître le message après 3 secondes
      setTimeout(() => {
        setCartMessage(null);
      }, 3000);
    } catch (err) {
      console.error("Erreur lors de l'ajout au panier:", err);

      // Ajouter cette partie pour voir la réponse d'erreur complète
      if (err instanceof Response) {
        const errorText = await err.text();
        console.error("Détails de l'erreur:", errorText);
      }

      setCartMessage({ message: "Impossible d'ajouter le livre au panier", type: 'error' });

      setTimeout(() => {
        setCartMessage(null);
      }, 3000);
    } finally {
      // Désactiver le spinner
      setAddingToCart(prev => ({ ...prev, [bookId]: false }));
    }
  };

  // Ajoutez la navigation vers le panier
  const navigateToBasket = () => {
    window.location.href = '/basket';
  };

  if (loading) return <div className="loading">Chargement de la bibliothèque...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="shop-container">
      <h1>Bibliothèque Henri Potier</h1>
      <p className="shop-description">Découvrez notre sélection de livres magiques</p>

      {cartMessage && (
        <div className={`cart-message ${cartMessage.type}`}>
          {cartMessage.message}
        </div>
      )}

      <div className="books-grid">
        {books.map((book) => (
          <div key={book._id} className="book-card">
            <div className="book-image-container">
              <img src={book.image} alt={book.title} className="book-image" />
            </div>
            <div className="book-details">
              <h2 className="book-title">{book.title}</h2>
              <p className="book-author">par {book.author}</p>
              <p className="book-price">{book.price} €</p>
              <p className="book-description">{book.description}</p>
              <div className="book-actions">
                <button
                  className="add-to-cart-button"
                  onClick={() => addToCart(book._id)}
                  disabled={addingToCart[book._id]}
                >
                  {addingToCart[book._id] ? 'Ajout en cours...' : 'Ajouter au panier'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modale de confirmation d'ajout */}
      {modalBook && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Livre ajouté au panier"
          message="Le livre a été ajouté à votre panier avec succès."
          bookTitle={modalBook.title}
          bookCover={modalBook.image}
          buttonText="Voir mon panier"
          onButtonClick={navigateToBasket}
        />
      )}
    </div>
  );
}
