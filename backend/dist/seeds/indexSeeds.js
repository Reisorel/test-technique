"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const booksSeeds_1 = __importDefault(require("./booksSeeds"));
const basketSeeds_1 = __importDefault(require("./basketSeeds"));
const MONGO_URI = "mongodb://127.0.0.1:27017/henri-potier";
function seedAll() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(MONGO_URI);
            console.log("🔌 Connecté à MongoDB");
            yield (0, booksSeeds_1.default)();
            yield (0, basketSeeds_1.default)();
            yield mongoose_1.default.disconnect();
            console.log("✅ Seed terminé.");
        }
        catch (error) {
            console.error("❌ Erreur dans le seed :", error);
        }
    });
}
seedAll();
