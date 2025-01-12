from ..services.embedding_service import EmbeddingService
import logging

logger = logging.getLogger(__name__)

async def startup_event(app):
    """Evento que se ejecuta al iniciar la aplicación"""
    try:
        logger.info("Iniciando servicios...")
        embedding_service = EmbeddingService()
        app.state.embedding_service = embedding_service
        logger.info("Servicios iniciados correctamente")
    except Exception as e:
        logger.error(f"Error al iniciar servicios: {str(e)}")
        raise e