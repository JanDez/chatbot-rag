from sentence_transformers import SentenceTransformer
import json
import os
from typing import List, Dict, Any, Tuple
import logging

logger = logging.getLogger(__name__)

class EmbeddingService:
    def __init__(self):
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.texts = []
        self._initialize_data()
    # Using the json files in the data folder to initialize the data for the embedding model
    def _initialize_data(self):
        """Inicializa los datos desde los JSONs locales"""
        try:
            texts = []
            json_files = [
                "app/data/company_info.json",
                "app/data/services_info.json",
                "app/data/case_studies_info.json"
            ]
            
            for json_path in json_files:
                if os.path.exists(json_path):
                    with open(json_path, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                        texts.extend(self._extract_texts_from_json(data))
            
            if not texts:
                raise FileNotFoundError("No se encontraron archivos de información")
            
            self.texts = texts
            
        except Exception as e:
            logger.error(f"Error al inicializar datos: {str(e)}")
            self.texts = ["No se pudo obtener información de la empresa"]

    # Extract texts from the json files in the data folder
    def _extract_texts_from_json(self, data: Dict[str, Any]) -> List[str]:
        """Extrae textos de un diccionario JSON de forma recursiva"""
        texts = []
        
        def process_value(value, prefix=''):
            if isinstance(value, str):
                texts.append(f"{prefix}{value}".strip())
            elif isinstance(value, list):
                for item in value:
                    process_value(item, prefix)
            elif isinstance(value, dict):
                for k, v in value.items():
                    if k not in ['metadata', 'last_updated']:
                        new_prefix = f"{k}: " if prefix == '' else f"{prefix} {k}: "
                        process_value(v, new_prefix)
        
        process_value(data)
        return texts

    # Get the most relevant texts for a query
    def get_relevant_context(self, query: str, k: int = 3) -> List[str]:
        """Recupera los k textos más relevantes para una consulta"""
        if not self.texts:
            return ["No hay información disponible"]
        
        query_embedding = self.model.encode([query])
        text_embeddings = self.model.encode(self.texts)
        
        # Calculate cosine similarity
        similarities = [(text, similarity) for text, similarity in 
                       zip(self.texts, text_embeddings @ query_embedding.T)]
        
        # Sort by similarity and get the k most relevant
        relevant_texts = sorted(similarities, key=lambda x: x[1], reverse=True)[:k]
        return [text for text, _ in relevant_texts]

    # Get the formatted context for a query
    def get_formatted_context(self, query: str, company_name: str, k: int = 3) -> Tuple[str, List[str]]:
        relevant_texts = self.get_relevant_context(query, k)
        context_text = ' '.join(relevant_texts)
        
        formatted_context = f"""
        You are a helpful AI assistant for {company_name}. Use the following information to answer questions in a natural, conversational way.

        Context:
        {context_text}

        Guidelines:
        - If asked about services, provide specific examples from our case studies
        - For technical questions, reference our capabilities and technologies
        - Always maintain a professional but friendly tone
        - If information is not available, be honest and suggest contacting the company directly

        Question: {query}

        Please provide a detailed, helpful response:
        """
        
        return formatted_context, relevant_texts