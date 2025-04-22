import { useEffect, useState } from 'react';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  bookTitle?: string;
  bookCover?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  message,
  bookTitle,
  bookCover,
  buttonText = "Continuer mes achats",
  onButtonClick
}: ModalProps) {
  const [animationClass, setAnimationClass] = useState('');

  // Gérer l'animation d'entrée et de sortie
  useEffect(() => {
    if (isOpen) {
      setAnimationClass('modal-enter');
      // Prévenir le défilement du body quand la modale est ouverte
      document.body.style.overflow = 'hidden';
    } else {
      setAnimationClass('modal-exit');
      // Réactiver le défilement quand la modale est fermée
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen && animationClass !== 'modal-exit') return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      onClose();
    }
  };

  const handleAnimationEnd = () => {
    if (animationClass === 'modal-exit') {
      setAnimationClass('');
    }
  };

  return (
    <div
      className={`modal-backdrop ${animationClass}`}
      onClick={handleBackdropClick}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>

        <h2 className="modal-title">{title}</h2>

        {bookCover && (
          <div className="modal-book-info">
            <img src={bookCover.replace('frontend/public', '')} alt={bookTitle} className="modal-book-cover" />
            <div className="modal-book-details">
              {bookTitle && <h3 className="modal-book-title">{bookTitle}</h3>}
              <p className="modal-message">{message}</p>
            </div>
          </div>
        )}

        {!bookCover && <p className="modal-message">{message}</p>}

        <div className="modal-actions">
          <button
            className="modal-button"
            onClick={handleButtonClick}
          >
            {buttonText}
          </button>

          <button
            className="modal-button modal-button-secondary"
            onClick={onClose}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
