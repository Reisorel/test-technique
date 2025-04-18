"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyDiscount = exports.getTotalPrice = exports.calculateBestDiscount = void 0;
/**
 * Calcule le meilleur prix après application des offres de remise
 * @param books Liste des livres dans le panier
 * @param offers Liste des offres disponibles
 * @returns Le résultat détaillé du calcul de remise
 */
const calculateBestDiscount = (books, offers) => {
    const totalPrice = (0, exports.getTotalPrice)(books);
    if (!books.length || !offers.length) {
        return {
            originalPrice: totalPrice,
            finalPrice: totalPrice,
            discount: 0,
            selectedOffer: null,
            offerDetails: "Aucune offre applicable"
        };
    }
    let bestPrice = totalPrice;
    let selectedOffer = null;
    let offerDetails = "";
    // Calculer le résultat pour chaque offre
    offers.forEach(offer => {
        const priceAfterDiscount = (0, exports.applyDiscount)(totalPrice, offer);
        const currentDiscount = totalPrice - priceAfterDiscount;
        console.log(`Offre testée: ${getOfferDescription(offer)} → Prix: ${priceAfterDiscount}€ (Économie: ${currentDiscount}€)`);
        if (priceAfterDiscount < bestPrice) {
            bestPrice = priceAfterDiscount;
            selectedOffer = offer;
            offerDetails = getOfferDescription(offer);
        }
    });
    const finalPrice = Math.round(bestPrice * 100) / 100; // Arrondir à 2 décimales
    const discount = totalPrice - finalPrice;
    console.log(`✅ Meilleure offre sélectionnée: ${offerDetails}`);
    console.log(`💰 Prix initial: ${totalPrice}€ → Prix final: ${finalPrice}€ (Économie: ${discount}€)`);
    return {
        originalPrice: totalPrice,
        finalPrice,
        discount,
        selectedOffer,
        offerDetails
    };
};
exports.calculateBestDiscount = calculateBestDiscount;
/**
 * Retourne une description textuelle de l'offre
 * @param offer L'offre à décrire
 * @returns Description de l'offre
 */
const getOfferDescription = (offer) => {
    switch (offer.type) {
        case 'percentage':
            return `Réduction de ${offer.value}% sur le prix total`;
        case 'minus':
            return `Réduction fixe de ${offer.value}€`;
        case 'slice':
            return `Réduction de ${offer.value}€ par tranche de ${offer.sliceValue}€`;
        default:
            return "Offre inconnue";
    }
};
/**
 * Calcule le prix total des livres
 */
const getTotalPrice = (books) => {
    return books.reduce((total, book) => total + book.price, 0);
};
exports.getTotalPrice = getTotalPrice;
/**
 * Applique une remise spécifique au prix total
 * @param totalPrice Le prix total avant remise
 * @param offer L'offre à appliquer
 * @returns Le prix après application de la remise
 */
const applyDiscount = (totalPrice, offer) => {
    switch (offer.type) {
        case 'percentage':
            // Réduction de x% sur le prix
            return totalPrice * (1 - offer.value / 100);
        case 'minus':
            // Réduction de x euros sur le prix
            return Math.max(0, totalPrice - offer.value); // Évite un prix négatif
        case 'slice':
            // Réduction de x euros par tranche de y euros
            if (offer.sliceValue && offer.sliceValue > 0) {
                const slices = Math.floor(totalPrice / offer.sliceValue);
                return totalPrice - (slices * offer.value);
            }
            return totalPrice;
        default:
            return totalPrice;
    }
};
exports.applyDiscount = applyDiscount;
