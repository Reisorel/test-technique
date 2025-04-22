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
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeBookIndex = exports.checkElasticsearchConnection = void 0;
const elasticsearch_1 = require("@elastic/elasticsearch");
// Créer le client Elasticsearch
const elasticClient = new elasticsearch_1.Client({
    node: "http://localhost:9200",
});
// Fonction pour vérifier la connexion à Elasticsearch
const checkElasticsearchConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Appel à l'API info pour vérifier la connexion
        const info = yield elasticClient.info();
        console.log('✅ Elasticsearch connecté avec succès!');
        console.log(`   Version: ${info.version.number}`);
        console.log(`   Cluster: ${info.cluster_name}`);
        return true;
    }
    catch (error) {
        console.error('❌ Erreur de connexion à Elasticsearch:', error);
        return false;
    }
});
exports.checkElasticsearchConnection = checkElasticsearchConnection;
// Fonction pour initialiser l'index des livres
const initializeBookIndex = () => __awaiter(void 0, void 0, void 0, function* () {
    const INDEX_NAME = 'books';
    try {
        // 1. Vérifier si l'index existe déjà
        const indexExists = yield elasticClient.indices.exists({ index: INDEX_NAME });
        if (indexExists) {
            console.log(`✅ L'index "${INDEX_NAME}" existe déjà`);
            return true;
        }
        // 2. Créer l'index avec les mappings appropriés pour les livres
        const response = yield elasticClient.indices.create({
            index: INDEX_NAME,
            body: {
                settings: {
                    analysis: {
                        analyzer: {
                            french_analyzer: {
                                type: 'french' // Analyzer optimisé pour le français
                            }
                        }
                    }
                },
                mappings: {
                    properties: {
                        title: {
                            type: 'text',
                            analyzer: 'french_analyzer',
                            fields: {
                                keyword: { type: 'keyword' } // Pour le tri et les agrégations
                            }
                        },
                        author: {
                            type: 'text',
                            analyzer: 'standard'
                        },
                        synopsis: {
                            type: 'text',
                            analyzer: 'french_analyzer'
                        },
                        price: { type: 'float' },
                        isbn: { type: 'keyword' },
                        image: { type: 'keyword' }
                    }
                }
            }
        });
        console.log(`✅ Index "${INDEX_NAME}" créé avec succès`);
        return true;
    }
    catch (error) {
        console.error('❌ Erreur lors de la création de l\'index:', error);
        return false;
    }
});
exports.initializeBookIndex = initializeBookIndex;
// Exporter le client par défaut
exports.default = elasticClient;
