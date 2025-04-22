import { Client } from '@elastic/elasticsearch';

// Créer le client Elasticsearch
const elasticClient = new Client({
  node: "http://localhost:9200",
});

// Fonction pour vérifier la connexion à Elasticsearch
export const checkElasticsearchConnection = async (): Promise<boolean> => {
  try {
    // Appel à l'API info pour vérifier la connexion
    const info = await elasticClient.info();
    console.log('✅ Elasticsearch connecté avec succès!');
    console.log(`   Version: ${info.version.number}`);
    console.log(`   Cluster: ${info.cluster_name}`);
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion à Elasticsearch:', error);
    return false;
  }
};

// Fonction pour initialiser l'index des livres
export const initializeBookIndex = async (): Promise<boolean> => {
  const INDEX_NAME = 'books';

  try {
    // 1. Vérifier si l'index existe déjà
    const indexExists = await elasticClient.indices.exists({ index: INDEX_NAME });

    if (indexExists) {
      console.log(`✅ L'index "${INDEX_NAME}" existe déjà`);
      return true;
    }

    // 2. Créer l'index avec les mappings appropriés pour les livres
    const response = await elasticClient.indices.create({
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
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'index:', error);
    return false;
  }
};

// Exporter le client par défaut
export default elasticClient;
