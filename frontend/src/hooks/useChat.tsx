import { useMutation } from '@tanstack/react-query';

interface ChatMessage {
  message: string;
  company_name: string;
  chat_name?: string;
  user_email: string;
}

interface ChatResponse {
  reply: string;
}

export function useChat() {
  return useMutation<ChatResponse, Error, ChatMessage>({
    mutationFn: async (message: ChatMessage) => {
      const response = await fetch('http://127.0.0.1:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
      
      if (!response.ok) {
        throw new Error('Error en la comunicación con el chatbot');
      }
      
      return await response.json();
    }
  });
}