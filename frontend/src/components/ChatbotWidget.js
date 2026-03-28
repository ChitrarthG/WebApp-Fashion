import React, { useState, useRef, useEffect } from "react";
import "./ChatbotWidget.css";
import apiBaseUrl from "../config/api";

const INITIAL_SESSION_ID = "chat_" + Math.random().toString(36).slice(2);

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(INITIAL_SESSION_ID);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const openChat = async () => {
    setIsOpen(true);
    if (messages.length === 0) {
      await sendMessage("__start__", true);
    }
  };

  const sendMessage = async (text, silent = false) => {
    const msg = text || input.trim();
    if (!msg) return;
    if (!silent) {
      setMessages(prev => [...prev, { role: "user", text: msg }]);
    }
    setInput("");
    setLoading(true);
    try {
      const res = await fetch(`${apiBaseUrl}/chatbot/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, sessionId }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "bot", text: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "bot", text: "Sorry, I am having trouble connecting right now. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chatbot-widget">
      {/* Chat window */}
      {isOpen && (
        <div className="chat-window" role="dialog" aria-label="Vayu Fashion Shopping Assistant">
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar"></div>
              <div>
                <div className="chat-title">Vayu Fashion Assistant</div>
                <div className="chat-status">Online</div>
              </div>
            </div>
            <button className="chat-close" onClick={() => setIsOpen(false)} aria-label="Close chat"></button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.role}`}>
                {msg.role === "bot" && <div className="bot-avatar"></div>}
                <div className="msg-bubble">{msg.text}</div>
              </div>
            ))}
            {loading && (
              <div className="chat-msg bot">
                <div className="bot-avatar"></div>
                <div className="msg-bubble typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-row">
            <input
              type="text"
              placeholder="Ask me anything about fashion..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              aria-label="Chat message"
            />
            <button
              className="send-btn"
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              aria-label="Send message"
            >
              
            </button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        className="chat-toggle-btn"
        onClick={isOpen ? () => setIsOpen(false) : openChat}
        aria-label={isOpen ? "Close chat" : "Open shopping assistant"}
      >
        {isOpen ? "" : ""}
      </button>
    </div>
  );
};

export default ChatbotWidget;
