"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const db_1 = __importDefault(require("./config/db"));
const indexRoutes_1 = __importDefault(require("./routes/indexRoutes"));
const app = (0, express_1.default)(); // Créer une application express
(0, db_1.default)();
//Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes API centralisées
app.use('/api/shop', indexRoutes_1.default);
// Sert le frontend
app.use(express_1.default.static(path_1.default.resolve(__dirname, "../../frontend/dist")));
app.get("/", (req, res) => {
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
