import Book from "../models/book";

const books = [
  {
    title: "Henri Potier et la Chambre de l’Écho",
    author: "JK Bowling",
    isbn: 9781234560011,
    price: 35,
    image: "/images/covers/tome_1.png",
    description: "Premier tome des aventures de Henri Potier.",
  },
  {
    title: "Henri Potier et le Magicien Binaire",
    author: "JK Bowling",
    isbn: 9781234560028,
    price: 30,
    image: "/images/covers/tome_2.png",
    description: "Henri affronte un puissant sorcier développeur.",
  },
  {
    title: "Henri Potier et la Potion Git",
    author: "JK Bowling",
    isbn: 9781234560035,
    price: 25,
    image: "/images/covers/tome_3.png",
    description: "Une histoire de branches magiques et de merge conflictuels.",
  },
  {
    title: "Henri Potier et le Backend Interdit",
    author: "JK Bowling",
    isbn: 9781234560042,
    price: 28,
    image: "/images/covers/tome_4.png",
    description: "Henri explore les mystères du serveur obscur.",
  },
  {
    title: "Henri Potier et la Bibliothèque des Secrets",
    author: "JK Bowling",
    isbn: 9781234560059,
    price: 32,
    image: "/images/covers/tome_5.png",
    description: "Le savoir est magique, surtout en JSON.",
  },
];

export default async function seedBooks() {
  await Book.deleteMany({});
  const inserted = await Book.insertMany(books);

  console.log(`📚 ${inserted.length} livres Henri Potier insérés :`);
  inserted.forEach((book, index) => {
    console.log(`   ${index + 1}. ${book.title}`);
  });
}
