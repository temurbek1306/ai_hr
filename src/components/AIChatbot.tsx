import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react'
import { sendMessageToAI, ChatMessage } from '../services/openaiService'

type Message = {
    id: number
    text: string
    sender: 'user' | 'bot'
    timestamp: Date
}

export default function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: "Assalomu alaykum! Men IT Park HR yordamchisiman. Tizim bo'yicha qanday savolingiz bor?",
            sender: 'bot',
            timestamp: new Date()
        }
    ])
    const [inputText, setInputText] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isOpen, isTyping])

    const handleSend = async () => {
        if (!inputText.trim()) return

        // 1. Add User Message
        const userMsgText = inputText
        const newUserMsg: Message = {
            id: Date.now(),
            text: userMsgText,
            sender: 'user',
            timestamp: new Date()
        }

        setMessages(prev => [...prev, newUserMsg])
        setInputText('')
        setIsTyping(true)

        // 2. Prepare History for AI (Convert to ChatMessage format)
        // We take the last 10 messages for context to save tokens
        const history: ChatMessage[] = messages.slice(-10).map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
        }))
        // Add current message
        history.push({ role: 'user', content: userMsgText })

        // 3. Get AI Response
        const responseText = await sendMessageToAI(history)

        // 4. Add Bot Message
        const newBotMsg: Message = {
            id: Date.now() + 1,
            text: responseText || "Kechirasiz, javob bera olmadim.",
            sender: 'bot',
            timestamp: new Date()
        }

        setMessages(prev => [...prev, newBotMsg])
        setIsTyping(false)
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <>
            {/* Toggle Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-primary-600 to-green-500 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-primary-500/50 transition-shadow ${isOpen ? 'hidden md:flex' : 'flex'}`}
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-0 right-0 md:bottom-24 md:right-6 z-40 w-full h-[100dvh] md:w-[400px] md:h-[500px] bg-white md:rounded-2xl shadow-xl border border-gray-100 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-primary-600 to-green-500 text-white flex items-center justify-between shadow-sm shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                    <Bot className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold">HR Yordamchi</h3>
                                    <p className="text-xs text-primary-100 flex items-center gap-1">
                                        <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                                        Online (AI Powered)
                                    </p>
                                </div>
                            </div>

                            {/* Close Button (Visible on all, crucial for mobile) */}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex items-start gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-primary-100 text-primary-600' : 'bg-green-100 text-green-600'
                                        }`}>
                                        {msg.sender === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                                    </div>
                                    <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
                                        ? 'bg-primary-600 text-white rounded-tr-none'
                                        : 'bg-white border border-gray-200 text-gray-700 rounded-tl-none shadow-sm'
                                        }`}>
                                        {msg.text}
                                        <div className={`text-[10px] mt-1 ${msg.sender === 'user' ? 'text-primary-200' : 'text-gray-400'}`}>
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Typing Indicator */}
                            {isTyping && (
                                <div className="flex items-start gap-2">
                                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                                        <Bot className="w-5 h-5" />
                                    </div>
                                    <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-none shadow-sm">
                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-gray-100">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    // Disabled while typing to prevent spamming context
                                    onKeyPress={!isTyping ? handleKeyPress : undefined}
                                    placeholder={isTyping ? "AI javob yozmoqda..." : "Savolingizni yozing..."}
                                    disabled={isTyping}
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-sm disabled:bg-gray-50 disabled:text-gray-400"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!inputText.trim() || isTyping}
                                    className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                                >
                                    {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
