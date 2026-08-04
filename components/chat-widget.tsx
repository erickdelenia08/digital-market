'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, Sparkles, User } from 'lucide-react';

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const { messages, sendMessage } = useChat();

    // Ref untuk mendeteksi area luar Chat Window
    const widgetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        // Fungsi penutup saat klik di luar area widget
        const handleClickOutside = (event: MouseEvent) => {
            if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        // Pasang listener saat widget terbuka
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup listener saat widget tertutup / unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div
            ref={widgetRef}
            className="fixed bottom-5 right-5 z-50 font-sans selection:bg-indigo-600 selection:text-white"
        >
            {/* Floating Button (Tactile Style) */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="relative bg-slate-900 hover:bg-indigo-600 text-white p-4 rounded-2xl shadow-xl border border-slate-700/80 hover:scale-105 active:scale-95 transition-all duration-200 group flex items-center justify-center"
                    aria-label="Open AI Chat"
                >
                    <MessageCircle className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300" />

                    {/* Status Indicator Green Pulse */}
                    <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
                    </span>
                </button>
            )}

            {/* Chat Window Container */}
            {isOpen && (
                <div className="w-80 sm:w-96 h-125 bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">

                    {/* Header (Tactile Dark Bar) */}
                    <div className="p-4 bg-slate-900 text-white flex justify-between items-center border-b border-slate-800">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-cyan-400 shadow-inner">
                                <Bot className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="flex items-center gap-1.5">
                                    <h3 className="font-bold text-xs text-white">AI Assistant</h3>
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                        v4.0
                                    </span>
                                </div>
                                <p className="text-[10px] text-slate-400">CodeGraph Support Agent</p>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                            aria-label="Close Chat"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Messages List Area */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
                        {messages.length === 0 && (
                            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm text-center space-y-2 mt-4">
                                <div className="w-9 h-9 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center mx-auto text-indigo-600 shadow-inner">
                                    <Sparkles className="w-4 h-4" />
                                </div>
                                <p className="text-xs font-bold text-slate-800">Hello! What can I help you?</p>
                                <p className="text-[11px] text-slate-500 leading-relaxed">
                                    Ask about digital products, licenses, or payment issues.
                                </p>
                            </div>
                        )}

                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'
                                    }`}
                            >
                                {message.role !== 'user' && (
                                    <div className="w-6 h-6 rounded-lg bg-slate-900 text-cyan-400 flex items-center justify-center text-[10px] shrink-0 mt-0.5 shadow-sm">
                                        <Bot className="w-3.5 h-3.5" />
                                    </div>
                                )}

                                <div
                                    className={`p-3 rounded-2xl text-xs max-w-[80%] whitespace-pre-wrap leading-relaxed shadow-sm ${message.role === 'user'
                                        ? 'bg-indigo-600 text-white rounded-br-none'
                                        : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-none'
                                        }`}
                                >
                                    {message.parts.map((part, i) => {
                                        switch (part.type) {
                                            case 'text':
                                                return <span key={`${message.id}-${i}`}>{part.text}</span>;
                                            default:
                                                return null;
                                        }
                                    })}
                                </div>

                                {message.role === 'user' && (
                                    <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] shrink-0 mt-0.5 border border-indigo-200">
                                        <User className="w-3.5 h-3.5" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Input Form Area */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (!input.trim()) return;
                            sendMessage({ text: input });
                            setInput('');
                        }}
                        className="p-3 bg-white border-t border-slate-200/80 flex items-center gap-2"
                    >
                        <input
                            className="flex-1 text-xs bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-600 transition-all shadow-inner"
                            value={input}
                            placeholder="Write your question..."
                            onChange={(e) => setInput(e.currentTarget.value)}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim()}
                            className="bg-slate-900 hover:bg-indigo-600 disabled:opacity-50 text-white p-2.5 rounded-xl transition-all shadow-md active:scale-95"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>

                </div>
            )}
        </div>
    );
}