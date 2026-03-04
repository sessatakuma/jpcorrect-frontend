import React, { useState, useRef, useEffect } from 'react';

import { Send } from 'lucide-react';

import 'components/Hint.css';

interface ChatMessage {
    id: number;
    sender: 'ai' | 'user';
    text: string;
}

export default function Hint() {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: 0, sender: 'ai', text: 'AI はまだ寝ている…' },
    ]);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const chatRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = () => {
        if (!inputRef.current) {
            return;
        }
        const text = inputRef.current.value.trim();
        inputRef.current.value = '';
        if (text === '') return;

        const newMessage: ChatMessage = {
            id: Date.now(),
            sender: 'user',
            text,
        };
        setMessages((prev) => [...prev, newMessage]);
    };

    return (
        <section className='hint'>
            <div className='response' ref={chatRef}>
                {messages.map((msg) => (
                    <p key={msg.id} className={`bubble ${msg.sender}`}>
                        {msg.text}
                    </p>
                ))}
            </div>
            <form
                className='input-area'
                onSubmit={(e) => {
                    e.preventDefault();
                }}
            >
                <input className='input' ref={inputRef} placeholder='メッセージを入力...'></input>
                <button className='send' onClick={sendMessage}>
                    <Send className='icon' size={20} fill='currentColor' />
                </button>
            </form>
        </section>
    );
}
