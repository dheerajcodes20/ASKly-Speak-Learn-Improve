import Image from 'next/image';
import React, { useEffect, useMemo, useRef } from 'react';
import { useUser } from '@stackframe/stack';

const AVATAR_AI = '/ai-avatar.png';

// Advanced text cleaning utility
const cleanText = (text) => {
    if (!text || typeof text !== 'string') return '';
    return text
        .replace(/\b(undefined|null|NaN)\b/gi, '')
        .replace(/undefined|null|NaN/gi, '')
        .replace(/\s+/g, ' ')
        .replace(/(\b\w+\b)(\s+\1\b)+/g, '$1') // Remove consecutive duplicate words
        .trim();
};

function AnimatedMessage({ content, align, avatar, bubbleColor, textColor, isLast, onDone, senderName, isAITyping }) {
    const [displayed, setDisplayed] = React.useState('');
    
    useEffect(() => {
        const cleanedContent = cleanText(content);
        if (!cleanedContent) {
            if (onDone) onDone();
            return;
        }
        
        // Show full message immediately instead of word by word
        setDisplayed(cleanedContent);
        if (onDone) {
            setTimeout(onDone, 500); // Small delay for smooth UI
        }
    }, [content, onDone]);

    return (
        <div className={`flex items-start gap-2 ${align}`}>
            {align === 'justify-start' && (
                <div className="flex flex-col items-center min-w-[44px]">
                    <Image 
                        src={avatar} 
                        alt={senderName || "AI"} 
                        width={36} 
                        height={36} 
                        className="rounded-full shadow"
                    />
                    {senderName && <span className="text-xs text-gray-500 mt-1">{senderName}</span>}
                </div>
            )}
            
            <div className={`px-5 py-3 rounded-2xl max-w-[70%] shadow-lg ${bubbleColor} ${textColor}`}>
                <p className="whitespace-pre-wrap">{displayed}</p>
                {isLast && isAITyping && <span className="animate-blink ml-1">|</span>}
            </div>

            {align === 'justify-end' && (
                <div className="flex flex-col items-center min-w-[44px]">
                    <Image                        src={avatar} 
                        alt={senderName || "User"} 
                        width={36} 
                        height={36} 
                        className="rounded-[16px] shadow-md hover:shadow-lg transition-shadow"
                    />
                    {senderName && <span className="text-xs text-gray-500 mt-1">{senderName}</span>}
                </div>
            )}
        </div>
    );
}

function ChatBox({ conversation = [], loadingAI = false, aiName = 'Joey', userName = 'You', aiAvatar = '/ai-avatar.png', conversationEnded = false }) {
    const messagesEndRef = useRef(null);

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversation]);

    // Deduplicate messages while preserving order
    const filteredMessages = useMemo(() => {
        const seen = new Set();
        return conversation.filter(msg => {
            const key = `${msg.role}-${msg.content}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }, [conversation]);

    return (
        <div className="flex-1 h-[calc(100vh-315px)] bg-white rounded-lg shadow-sm flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {filteredMessages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-4">
                        Start your conversation...
                    </div>
                ) : (
                    filteredMessages.map((message, index) => {
                        const isUser = message.role === 'user';
                        return (
                            <div
                                key={`${index}-${message.role}-${message.content}`}
                                className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-start gap-2`}
                            >
                                {!isUser && (
                                    <div className="flex-shrink-0">
                                        <img
                                            src={aiAvatar}
                                            alt={aiName}
                                            className="w-8 h-8 rounded-full"
                                        />
                                    </div>
                                )}
                                <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                                    <span className="text-sm text-gray-600 mb-1">
                                      {isUser ? userName : aiName}
                                    </span>
                                    <div
                                        className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                                            isUser
                                              ? 'bg-blue-500 text-white rounded-br-sm'
                                              : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                                        }`}
                                    >
                                        {message.content}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
                {loadingAI && !conversationEnded && (
                    <div className="flex items-start gap-2">
                        <div className="flex-shrink-0">
                            <img
                                src={aiAvatar}
                                alt={aiName}
                                className="w-8 h-8 rounded-full"
                            />
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-sm text-gray-600 mb-1">{aiName}</span>
                            <div className="bg-gray-100 rounded-2xl px-4 py-2 rounded-bl-sm">
                              <div className="flex gap-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                              </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ChatBox;
