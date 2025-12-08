import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Sparkles, Loader2 } from 'lucide-react';
import { ChatMessage, Product, Language } from '../types';
import { createFashionAssistant, ChatSession } from '../services/geminiService';

interface AIStylistProps {
    products: Product[];
    language: Language;
}

export const AIStylist: React.FC<AIStylistProps> = ({ products, language }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatSessionRef = useRef<ChatSession | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const t = (ar: string, en: string) => language === 'ar' ? ar : en;

    // Initialize chat session when opened for the first time
    useEffect(() => {
        if (isOpen && !chatSessionRef.current) {
            try {
                chatSessionRef.current = createFashionAssistant(products);
                setMessages([{
                    role: 'model',
                    text: t(
                        'أهلاً بك في بازار لوك! 🛍️ أنا مساعدك الذكي لتنسيق الأزياء. كيف يمكنني مساعدتك في اختيار إطلالتك اليوم؟ ✨', 
                        'Welcome to Bazzr lok! 🛍️ I am your AI fashion assistant. How can I help you style your outfit today? ✨'
                    )
                }]);
            } catch (error) {
                console.error("Failed to init AI:", error);
                setMessages([{
                    role: 'model',
                    text: t('عذراً، المساعد الذكي غير متاح حالياً.', 'Sorry, AI assistant is currently unavailable.'),
                    isError: true
                }]);
            }
        }
    }, [isOpen, products, language]);

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userText = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userText }]);
        setIsLoading(true);

        try {
            if (chatSessionRef.current) {
                const responseText = await chatSessionRef.current.sendMessage(userText);
                setMessages(prev => [...prev, { role: 'model', text: responseText }]);
            } else {
                 setMessages(prev => [...prev, { role: 'model', text: t('حدث خطأ في الاتصال.', 'Connection error.') }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'model', text: t('حدث خطأ، يرجى المحاولة لاحقاً.', 'An error occurred, please try again.'), isError: true }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed z-40 bottom-6 ${language === 'ar' ? 'left-6' : 'right-6'} w-14 h-14 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-full shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 flex items-center justify-center text-white transform hover:scale-110 active:scale-95 group`}
                aria-label="AI Stylist"
            >
                {isOpen ? (
                    <X size={24} className="transition-transform duration-300 rotate-90 group-hover:rotate-0" />
                ) : (
                    <div className="relative">
                        <Sparkles size={24} className="animate-pulse" />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                    </div>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className={`fixed z-50 bottom-24 ${language === 'ar' ? 'left-6' : 'right-6'} w-[90vw] sm:w-[360px] h-[550px] max-h-[70vh] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-300`}>
                    
                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 flex items-center justify-between text-white shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                                <Sparkles size={18} />
                            </div>
                            <div>
                                <h3 className="font-bold text-base">{t('مساعد الأزياء', 'Fashion Assistant')}</h3>
                                <div className="flex items-center gap-1.5 opacity-90">
                                    <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"></span>
                                    <span className="text-xs">{t('يعمل الآن', 'Online')}</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-lg p-1.5">
                            <X size={16} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 scroll-smooth">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                    msg.role === 'user' 
                                        ? 'bg-emerald-600 text-white rounded-br-sm' 
                                        : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-2">
                                    <Loader2 size={16} className="animate-spin text-emerald-600" />
                                    <span className="text-xs text-gray-500 font-medium">{t('جاري التفكير...', 'Thinking...')}</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white border-t border-gray-100 shrink-0">
                        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-2 py-2 border border-gray-200 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/20 transition-all shadow-inner">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder={t('اكتب سؤالك هنا...', 'Ask me anything...')}
                                className="flex-1 bg-transparent outline-none text-sm text-gray-700 h-9 px-2"
                                dir="auto"
                            />
                            <button 
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95 transform duration-100"
                            >
                                <Send size={16} className={language === 'ar' ? 'rotate-180' : ''} />
                            </button>
                        </div>
                        <div className="text-center mt-2">
                            <p className="text-[10px] text-gray-400">{t('مدعوم بواسطة Gemini AI', 'Powered by Gemini AI')}</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};