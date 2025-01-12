from langchain_community.llms import HuggingFacePipeline
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
from .embedding_service import EmbeddingService
import logging
import torch
import transformers
import os
from huggingface_hub import HfApi

logger = logging.getLogger(__name__)

class ChatService:
    def __init__(self):
        self.tokenizer = None
        self.model = None
        self.embedding_service = EmbeddingService()
        self.llm = None
        self.chain = None
        self.prompt_template = PromptTemplate(
            input_variables=["context", "question", "chat_name"],
            template="""You are {chat_name}. Use the following context to answer the question. Be concise and direct.

Context: {context}

Question: {question}

Answer:"""
        )

    def _load_model(self):
        if self.model is None:
            try:
                logger.info("Cargando TinyLlama-1.1B-Chat...")
                
                self.tokenizer = AutoTokenizer.from_pretrained(
                    "TinyLlama/TinyLlama-1.1B-Chat-v1.0",
                    trust_remote_code=True
                )
                
                self.model = AutoModelForCausalLM.from_pretrained(
                    "TinyLlama/TinyLlama-1.1B-Chat-v1.0",
                    torch_dtype=torch.float16,
                    device_map="auto",
                    trust_remote_code=True
                )
                
                # Configurar pipeline con parámetros optimizados
                pipeline = transformers.pipeline(
                    "text-generation",
                    model=self.model,
                    tokenizer=self.tokenizer,
                    max_length=512,
                    temperature=0.7,
                    top_p=0.95,
                    repetition_penalty=1.15,
                    do_sample=True,
                    pad_token_id=self.tokenizer.eos_token_id
                )
                
                self.llm = HuggingFacePipeline(pipeline=pipeline)
                self.chain = LLMChain(llm=self.llm, prompt=self.prompt_template)
                
            except Exception as e:
                logger.error(f"Error al cargar el modelo: {str(e)}")
                raise ValueError("Error al cargar el modelo")

    def generate_response(self, input_text: str, company_name: str, chat_name: str = "Promtior AI Assistant") -> str:
        try:
            if self.model is None:
                self._load_model()
                
            formatted_context, _ = self.embedding_service.get_formatted_context(input_text, company_name)
            
            response = self.chain.run(
                context=formatted_context,
                question=input_text,
                chat_name=chat_name
            )
            
            # Limpiar la respuesta de cualquier texto adicional
            clean_response = response.split("Answer:")[-1].strip()
            if "Context:" in clean_response:
                clean_response = clean_response.split("Context:")[0].strip()
            if "Question:" in clean_response:
                clean_response = clean_response.split("Question:")[0].strip()
            
            return clean_response
            
        except Exception as e:
            logger.error(f"Error generando respuesta: {str(e)}")
            return "Lo siento, hubo un error al procesar tu consulta. Por favor, intenta de nuevo."