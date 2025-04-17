import Basket from "../models/basket";

export default async function seedBaskets() {
  await Basket.deleteMany({});
  await Basket.create({
    empty: true,
    bookNumber: 0,
    totalPrice: 0,
    books: [],
  });
  console.log("🧺 Panier vide créé.");
}
