import { useState, useEffect } from 'react';
import './Basket.css';

// Interface pour un livre dans le panier
interface BasketBook {
  id: string;
  title: string;
  author: string;
  price: number;
  image: string;
  quantity: number;
}

// Interface pour les données du panier
interface BasketData {
  basketId: string;
  books: BasketBook[];
  totalPrice: number;
  discountedPrice: number;
  discount: number;
}

export default function Basket() {
  const [basketData, setBasketData] = useState<BasketData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingQuantity, setUpdatingQuantity] = useState<{ [key: string]: boolean }>({});
  const basketId = "680745c147db4aad10d4c81c"; // Assurez-vous que cet ID est correct

  const fetchBasket = async () => {
    try {
      setLoading(true);

      // Première étape: récupérer le panier de base
      const basketResponse = await fetch(`http://localhost:3000/api/shop/baskets/${basketId}`);

      // Si le panier n'existe pas ou est introuvable
      if (basketResponse.status === 404) {
        setBasketData({
          basketId: basketId,
          books: [],
          totalPrice: 0,
          discountedPrice: 0,
          discount: 0
        });
        return;
      }

      if (!basketResponse.ok) {
        throw new Error(`Erreur HTTP: ${basketResponse.status}`);
      }

      const basketData = await basketResponse.json();

      // Si le panier existe mais est vide, pas besoin d'appeler l'API discounts
      if (basketData.books.length === 0 || basketData.bookNumber === 0) {
        setBasketData({
          basketId: basketId,
          books: basketData.books.map(item => ({
            id: item.bookId._id || item.bookId,
            title: item.bookId.title || "Titre inconnu",
            author: item.bookId.author || "Auteur inconnu",
            price: item.bookId.price || 0,
            image: item.bookId.image || "",
            quantity: item.quantity || 0
          })),
          totalPrice: basketData.totalPrice || 0,
          discountedPrice: basketData.totalPrice || 0,
          discount: 0
        });
        return;
      }

      // Si le panier contient des livres, appeler l'API discounts
      const discountResponse = await fetch(`http://localhost:3000/api/shop/discounts/${basketId}`);

      if (!discountResponse.ok) {
        // En cas d'erreur, utiliser les données du panier sans remise
        setBasketData({
          basketId: basketId,
          books: basketData.books.map(item => ({
            id: item.bookId._id || item.bookId,
            title: item.bookId.title || "Titre inconnu",
            author: item.bookId.author || "Auteur inconnu",
            price: item.bookId.price || 0,
            image: item.bookId.image || "",
            quantity: item.quantity || 0
          })),
          totalPrice: basketData.totalPrice || 0,
          discountedPrice: basketData.totalPrice || 0,
          discount: 0
        });
        return;
      }

      // Récupérer les données avec remises
      const discountData = await discountResponse.json();
      setBasketData(discountData);

    } catch (err) {
      console.error("Erreur lors de la récupération du panier:", err);
      setError("Une erreur est survenue lors du chargement de votre panier");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBasket();
  }, []);

  // Fonction pour augmenter la quantité d'un article
  const increaseQuantity = async (bookId: string) => {
    if (!basketData) return;

    try {
      // Marquer le livre comme étant en cours de mise à jour
      setUpdatingQuantity(prev => ({ ...prev, [bookId]: true }));

      // Appel à l'API pour ajouter le livre au panier
      const response = await fetch(`http://localhost:3000/api/shop/baskets/${basketId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookId: bookId,
          quantity: 1  // Nous ajoutons 1 exemplaire à chaque clic
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      // Récupérer les données mises à jour du panier
      const data = await response.json();
      console.log("Panier mis à jour:", data);

      // Recharger toutes les données du panier avec les remises
      await fetchBasket();

    } catch (err) {
      console.error("Erreur lors de l'augmentation de la quantité:", err);
    } finally {
      // Marquer la fin de la mise à jour
      setUpdatingQuantity(prev => ({ ...prev, [bookId]: false }));
    }
  };

  // Modifier decreaseQuantity en supprimant la vérification
  const decreaseQuantity = async (bookId: string) => {
    if (!basketData) return;

    try {
      // Marquer le livre comme étant en cours de mise à jour
      setUpdatingQuantity(prev => ({ ...prev, [bookId]: true }));

      // Utiliser la route DELETE avec les IDs dans l'URL
      const response = await fetch(
        `http://localhost:3000/api/shop/baskets/${basketId}/books/${bookId}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      // Récupérer les données mises à jour
      const data = await response.json();
      console.log("Panier mis à jour après diminution:", data);

      // Recharger toutes les données du panier avec la même fonction que dans useEffect
      await fetchBasket();

    } catch (err) {
      console.error("Erreur lors de la diminution de la quantité:", err);
      // Gérer l'erreur (afficher un message à l'utilisateur, etc.)
    } finally {
      // Marquer la fin de la mise à jour
      setUpdatingQuantity(prev => ({ ...prev, [bookId]: false }));
    }
  };

  // Modifiez la partie rendu pour un message plus convivial
  if (loading) return <div>Chargement du panier...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!basketData) return <div className="empty-basket-message">Votre panier est actuellement vide</div>;

  return (
    <div className="basket_container">
      <h1>Votre Panier</h1>
      <div className='basket_card'>
        {basketData.books.length === 0 ? (
          <div className="empty-basket-message">
            <p>Votre panier est actuellement vide</p>
            <button className="back-to-shop" onClick={() => window.location.href = '/'}>
              Découvrir nos livres
            </button>
          </div>
        ) : (
          <>
            <div className="basket_items">
              {basketData.books.map((book) => (
                <div key={book.id} className="basket_item">
                  <div className="basket-image-container">
                    <img
                      src={book.image.replace('frontend/public', '')}
                      alt={book.title}
                      className="basket-image"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/images/covers/default.png';
                      }}
                    />
                  </div>
                  <div className="book_details">
                    <h3>{book.title}</h3>
                    <p>Prix unitaire: {book.price}€</p>
                    <div className="quantity_control">
                      <button
                        className="quantity_button minus"
                        onClick={() => decreaseQuantity(book.id)}
                        disabled={updatingQuantity[book.id]}
                      >
                        {updatingQuantity[book.id] ? '...' : '-'}
                      </button>
                      <span className="quantity">{book.quantity}</span>
                      <button
                        className="quantity_button plus"
                        onClick={() => increaseQuantity(book.id)}
                        disabled={updatingQuantity[book.id]}
                      >
                        {updatingQuantity[book.id] ? '...' : '+'}
                      </button>
                    </div>
                    <p>Sous-total: {book.price * book.quantity}€</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="basket_summary">
              <h2>Récapitulatif</h2>

              {/* Liste des livres dans le récapitulatif */}
              <div className="summary_books_list">
                <h3>Détail de votre commande</h3>
                <table className="summary_books_table">
                  <thead>
                    <tr>
                      <th>Titre</th>
                      <th>Prix</th>
                      <th>Quantité</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {basketData.books.map((book) => (
                      <tr key={book.id}>
                        <td>{book.title}</td>
                        <td>{book.price}€</td>
                        <td>{book.quantity}</td>
                        <td>{book.price * book.quantity}€</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <hr className="summary_divider" />

              {/* Partie récapitulative des totaux */}
              <div className="summary_row">
                <span className="label">Sous-total</span>
                <span className="value">{basketData.totalPrice}€</span>
              </div>

              {basketData.discount > 0 && (
                <div className="summary_row">
                  <span className="label">Remise</span>
                  <span className="value discount">-{basketData.discount}€</span>
                </div>
              )}

              <div className="summary_row total">
                <span className="label">Total</span>
                <span className="value">
                  {basketData.discount > 0 && (
                    <span className="original_price">{basketData.totalPrice}€</span>
                  )}
                  {(basketData.totalPrice - (basketData.discount || 0))}€
                </span>
              </div>

              <button className="checkout_button">
                Passer commande
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
