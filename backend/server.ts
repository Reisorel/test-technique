import express, { Express, Request, Response } from "express";
import cors from "cors";
import path from "path";
import connectDB from "./config/db";
import router from "./routes/indexRoutes"

const app: Express = express(); // Créer une application express
connectDB();

//Middlewares
app.use(cors());
app.use(express.json());

// Routes API centralisées
app.use('/api/shop', router)

// Sert le frontend
app.use(express.static(path.resolve(__dirname, "../../frontend/dist")));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", message: "API is running 🏄🏻‍♂️" });
});

// Catch all route frontend
// app.get("*", (req: Request, res: Response) => {
//   res.sendFile(path.resolve(__dirname, "../../frontend/dist", "index.html"));
// });

// Lancement du servceur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅Serveur is running on http://localhost:${PORT}`);
});
