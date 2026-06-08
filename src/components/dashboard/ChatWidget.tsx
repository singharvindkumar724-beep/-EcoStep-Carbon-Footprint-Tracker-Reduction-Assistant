"use client";

import React, { useState, useEffect, useRef } from "react";
import { useEcoStore } from "@/store/useEcoStore";
import { MessageCircle, X, Send, Sparkles, Trash2, ShieldAlert } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const QUICK_CHIPS = [
  "I biked 10 km instead of driving today!",
  "Suggest a simple vegan meal swap",
  "How can I cut my household energy?",
  "How much CO₂ does a long flight emit?",
] as const;

export default function ChatWidget() {
  const { userProfile } = useEcoStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hello! I'm your **EcoStep Climate Coach**. 🌿 Tell me about a green action you did today, or ask me any question about reducing your carbon footprint!",
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Close chat on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  console.log("ChatWidget userProfile state:", userProfile);
  if (!userProfile) return null;

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    setError(null);
    const newMessages = [...messages, { role: "user" as const, content: text }];
    setMessages(newMessages);
    setInputVal("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          history: messages.slice(1), // omit the initial welcome message from Gemini context
          profile: userProfile,
        }),
      });

      if (!res.ok) {
        throw new Error(`Chat failed with status ${res.status}`);
      }

      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        throw new Error("No response reply received from assistant");
      }
    } catch (err: unknown) {
      console.error("Chat message error:", err);
      setError(err instanceof Error ? err.message : "Could not reach AI Coach. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputVal);
  };

  const handleClearChat = () => {
    if (confirm("Are you sure you want to clear your conversation history?")) {
      setMessages([
        {
          role: "assistant",
          content: "Chat cleared! Let's start fresh. How can I help you reduce your carbon footprint today? 🌿",
        },
      ]);
      setError(null);
    }
  };

  // Safe markdown bold/list parser
  const formatMessageText = (rawText: string) => {
    let formatted = rawText.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    formatted = formatted.replace(/^\*\s(.*)$/gm, "• $1");
    return formatted.split("\n").map((line, idx) => (
      <p key={idx} className="mb-1 last:mb-0" dangerouslySetInnerHTML={{ __html: line }} />
    ));
  };

  return (
    <>
      {/* 1. Floating Speech Bubble FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 p-4 bg-primary-green hover:bg-primary-hover text-white rounded-full shadow-elevated focus:outline-none focus:ring-4 focus:ring-primary-light cursor-pointer hover:scale-105 active:scale-95 transition-all flex items-center justify-center`}
        aria-label="Open AI Climate Coach Chatbot"
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* 2. Slide-up Chat Drawer Window */}
      {isOpen && (
        <div
          className="fixed bottom-36 right-4 md:bottom-24 md:right-6 z-50 w-96 max-w-[calc(100vw-32px)] h-[500px] bg-white rounded-card shadow-modal border border-gray-200 flex flex-col justify-between overflow-hidden animate-scaleUp"
          role="dialog"
          aria-modal="true"
          aria-labelledby="chat-header-title"
        >
          {/* Header Banner */}
          <div className="bg-primary-dark text-white px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1 bg-white/10 rounded-lg text-primary-light">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <h3 id="chat-header-title" className="text-sm font-extrabold tracking-tight">AI Climate Coach</h3>
                <span className="flex items-center gap-1.5 text-[9px] text-primary-light font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> Online
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition"
                aria-label="Clear chat logs"
                title="Reset conversation"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Feed View */}
          <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-gray-50/50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary-green text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-150 rounded-bl-none shadow-sm"
                  }`}
                >
                  {formatMessageText(msg.content)}
                </div>
              </div>
            ))}

            {/* Loading Indicator Bubble */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-150 rounded-2xl rounded-bl-none px-4 py-3 text-xs text-gray-400 flex items-center gap-1 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}

            {/* Error Notification banner */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-[11px] rounded-btn flex items-start gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Emissions Analysis Failed</p>
                  <p className="text-red-600 mt-0.5">{error}</p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick recommendations chips */}
          {messages.length === 1 && !isLoading && (
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-1.5">
              {QUICK_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip)}
                  className="text-[10px] font-semibold bg-white border border-gray-200 hover:border-primary-green hover:text-primary-green text-gray-600 px-2.5 py-1 rounded-full transition cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Form input controls */}
          <form
            onSubmit={handleFormSubmit}
            className="p-3 border-t border-gray-150 bg-white flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask climate coach or log habit..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              disabled={isLoading}
              className="flex-grow h-10 px-3 border border-gray-300 rounded-input text-xs text-gray-900 focus:border-primary-green focus:ring-1 focus:ring-primary-green outline-none disabled:bg-gray-55"
              aria-label="Chat input message"
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || isLoading}
              className="w-10 h-10 flex items-center justify-center bg-primary-green hover:bg-primary-hover disabled:bg-gray-150 text-white rounded-btn transition shrink-0 cursor-pointer disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
