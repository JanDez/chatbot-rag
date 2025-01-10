import { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Send, ChevronUp } from 'lucide-react'
import { useChat } from '../hooks/useChat'
import { EmailValidationDialog } from './EmailValidationDialog'
import { useUserStore } from '../store/userStore'

interface Message {
  text: string
  isUser: boolean
  isLoading?: boolean
}

interface UserData {
  email: string;
  name: string;
}

export function ChatWindow({ onClose }: { onClose: () => void }) {
  const [isMinimized, setIsMinimized] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [showValidationDialog, setShowValidationDialog] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatMutation = useChat()
  const [isTyping, setIsTyping] = useState(false)
  const { userData: globalUserData, isUserValidated, validateUser } = useUserStore()

  useEffect(() => {
    validateUser();
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, validateUser])

  const handleSendMessage = async () => {
    if (!inputText.trim() || !globalUserData) return;

    const userMessage: Message = {
        text: inputText,
        isUser: true
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
        const response = await chatMutation.mutateAsync({
            message: inputText,
            company_name: "Promtior",
            chat_name: "Promtior AI Assistant",
            user_email: globalUserData.email
        });

        // Log the interaction
        await fetch('http://127.0.0.1:8000/api/log_interaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_email: globalUserData.email,
                user_name: globalUserData.name,
                interactions: [
                    {
                        timestamp: new Date().toISOString(),
                        user_message: inputText,
                        bot_response: response.reply
                    }
                ]
            }),
        });

        setIsTyping(false);

        const botMessage: Message = {
            text: response.reply,
            isUser: false
        };

        setMessages(prev => [...prev, botMessage]);
    } catch {
        setIsTyping(false);
        const errorMessage: Message = {
            text: "Lo siento, hubo un error al procesar tu mensaje.",
            isUser: false
        };
        setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };
  
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleValidUser = (data: UserData) => {
    console.log('User validated:', data);
    setShowValidationDialog(false);
    setMessages([{
      text: `¡Hola ${data.name}! Soy el asistente de Promtior. ¿En qué puedo ayudarte hoy?`,
      isUser: false
    }]);
    
    useUserStore.getState().setUserData(data);
    
    fetch('http://127.0.0.1:8000/api/log_user_activity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: data.email, name: data.name }),
    });
  };

  return (
    <>
      <EmailValidationDialog 
        isOpen={showValidationDialog} 
        onValidUser={handleValidUser} 
        onClose={() => setShowValidationDialog(false)} 
      />
      <div className={`fixed transition-all duration-300 ease-in-out ${isMinimized ? 'bottom-4 right-4 w-64 h-12' : isFullScreen ? 'inset-0 w-full h-full' : 'bottom-4 right-4 w-80 h-[32rem]'} bg-gray-900 border border-gray-700 rounded-lg shadow-lg overflow-hidden`} style={{ zIndex: 1000 }}>
        {/* Chat header */}
        <div className="flex items-center justify-between bg-gray-800 px-4 py-2">
          <div className="flex space-x-2">
            <button onClick={onClose} className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors" aria-label="Close chat" />
            <button onClick={() => setIsMinimized(!isMinimized)} className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors" aria-label="Minimize chat" />
            <button onClick={() => { setIsFullScreen(!isFullScreen); setIsMinimized(false); }} className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600 transition-colors" aria-label="Toggle fullscreen" />
          </div>
          <span className="text-white font-semibold">Promtior AI Assistant</span>
          <div className="w-12" />
        </div>

        {/* Chat content */}
        {!isMinimized && (
          <div className="flex flex-col h-[calc(100%-2.5rem)]">
            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-lg px-4 py-2 ${message.isUser ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                    {message.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[50%] rounded-lg px-4 py-2 bg-gray-700 text-gray-200">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="p-4 border-t border-gray-700">
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Type a message..."
                  value={inputText}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress}
                  className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  disabled={!isUserValidated}
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!inputText.trim() || !isUserValidated}
                  size="icon"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Send size={18} />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Minimized state */}
        {isMinimized && (
          <button 
            onClick={() => setIsMinimized(false)}
            className="w-full h-full flex items-center justify-between px-4 text-white hover:bg-gray-800 transition-colors"
          >
            <span>Promtior AI Assistant</span>
            <ChevronUp size={18} />
          </button>
        )}
      </div>
    </>
  )
}