import React from 'react';
import './ChatbotWidget.css';
import apiBaseUrl from '../config/api';

const SESSION_STORAGE_KEY = 'bookingChatSessionId';

function ChatbotWidget() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [messages, setMessages] = React.useState([]);
  const [sessionId, setSessionId] = React.useState(() => window.localStorage.getItem(SESSION_STORAGE_KEY) || '');
  const [sending, setSending] = React.useState(false);

  const sendMessage = React.useCallback(async (text, { silentUserMessage = false } = {}) => {
    const trimmed = text.trim();
    if (!trimmed || sending) {
      return;
    }

    if (!silentUserMessage) {
      setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    }

    setSending(true);
    try {
      const response = await fetch(`${apiBaseUrl}/chatbot/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionId || undefined,
          message: trimmed,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'Could not process chat request.');
      }

      if (payload.sessionId) {
        setSessionId(payload.sessionId);
        window.localStorage.setItem(SESSION_STORAGE_KEY, payload.sessionId);
      }

      setMessages((prev) => [...prev, { role: 'bot', text: payload.reply || 'Sorry, I did not understand that.' }]);
    } catch (error) {
      setMessages((prev) => [...prev, {
        role: 'bot',
        text: error.message || 'Could not connect to booking assistant. Please try again.',
      }]);
    } finally {
      setSending(false);
    }
  }, [sending, sessionId]);

  React.useEffect(() => {
    if (!isOpen || messages.length > 0 || sending) {
      return;
    }

    sendMessage('__start__', { silentUserMessage: true });
  }, [isOpen, messages.length, sendMessage, sending]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const messageToSend = input.trim();
    if (!messageToSend) {
      return;
    }

    setInput('');
    await sendMessage(messageToSend);
  };

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="chatbot-widget" aria-live="polite">
      {isOpen && (
        <section className="chatbot-panel" aria-label="Appointment booking assistant">
          <header className="chatbot-header">
            <h3>Book Appointment</h3>
            <button type="button" className="chatbot-close" onClick={toggleChat} aria-label="Close chat">
              x
            </button>
          </header>

          <div className="chatbot-body">
            {messages.length === 0 && <p className="chatbot-placeholder">Starting assistant...</p>}
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`chatbot-message ${message.role}`}>
                {message.text}
              </div>
            ))}
          </div>

          <form className="chatbot-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Type your message"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              disabled={sending}
              maxLength={500}
            />
            <button type="submit" disabled={sending || !input.trim()}>
              {sending ? '...' : 'Send'}
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        className="chatbot-toggle"
        onClick={toggleChat}
        aria-label={isOpen ? 'Close booking chatbot' : 'Open booking chatbot'}
      >
        {isOpen ? 'Close' : 'Chat'}
      </button>
    </div>
  );
}

export default ChatbotWidget;
