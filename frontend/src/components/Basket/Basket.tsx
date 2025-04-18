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

  useEffect(() => {
    // Fonction pour récupérer les données du panier
    const fetchBasket = async () => {
      try {
        setLoading(true);
        // Remplacer avec l'ID de votre panier
        const basketId = "6802723644a0058580d523eb";

        const response = await fetch(`http://localhost:3000/api/shop/discounts/${basketId}`);

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        setBasketData(data);
      } catch (err) {
        console.error("Erreur lors de la récupération du panier:", err);
        setError("Impossible de charger le panier");
      } finally {
        setLoading(false);
      }
    };

    fetchBasket();
  }, []);

  // Fonction pour augmenter la quantité d'un article
  const increaseQuantity = (bookId: string) => {
    if (!basketData) return;

    setBasketData(prevData => {
      if (!prevData) return prevData;

      return {
        ...prevData,
        books: prevData.books.map(book =>
          book.id === bookId
            ? { ...book, quantity: book.quantity + 1 }
            : book
        )
      };
    });

    // Ici, vous pourriez aussi envoyer une requête à votre API pour mettre à jour le panier
  };

  // Fonction pour diminuer la quantité d'un article
  const decreaseQuantity = (bookId: string) => {
    if (!basketData) return;

    setBasketData(prevData => {
      if (!prevData) return prevData;

      return {
        ...prevData,
        books: prevData.books.map(book =>
          book.id === bookId && book.quantity > 1
            ? { ...book, quantity: book.quantity - 1 }
            : book
        )
      };
    });

    // Ici, vous pourriez aussi envoyer une requête à votre API pour mettre à jour le panier
  };

  if (loading) return <div>Chargement du panier...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!basketData) return <div>Aucun panier trouvé</div>;

  return (
    <div className="basket_container">
      <h1>Votre Panier</h1>
      <div className='basket_card'>
        {basketData.books.length === 0 ? (
          <p>Votre panier est vide</p>
        ) : (
          <>
            <div className="basket_items">
              {basketData.books.map((book) => (
                <div key={book.id} className="basket_item">
                  <img src={book.image} alt={book.title} className="book_image" />
                  <div className="book_details">
                    <h3>{book.title}</h3>
                    <p>Prix unitaire: {book.price}€</p>
                    <div className="quantity_control">
                      <button
                        className="quantity_button minus"
                        onClick={() => decreaseQuantity(book.id)}
                        disabled={book.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="quantity">{book.quantity}</span>
                      <button
                        className="quantity_button plus"
                        onClick={() => increaseQuantity(book.id)}
                      >
                        +
                      </button>
                    </div>
                    <p>Sous-total: {book.price * book.quantity}€</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="basket_summary">
              <h2>Récapitulatif</h2>
              <p>Prix total: <span className="original_price">{basketData.totalPrice}€</span></p>
              {basketData.discount > 0 && (
                <p className="discount_info">Remise: -{basketData.discount}€</p>
              )}
              <p className="final_price">Prix final: {basketData.discountedPrice}€</p>
              <button className="checkout_button">Passer commande</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
