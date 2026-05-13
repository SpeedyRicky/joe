import { useState, useRef, useEffect } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import './App.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'joe';
  timestamp: Date;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m Joe. How can I help you today?',
      sender: 'joe',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Generate response
  const generateResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();

    // Coding help
    if (msg.includes('code') || msg.includes('javascript') || msg.includes('python') || msg.includes('react')) {
      return `Here's a JavaScript example:\n\nconst greet = (name) => {\n  console.log(\`Hello, \${name}!\`);\n};\n\ngreet('World');\n\nThis function takes a parameter and logs a greeting to the console.`;
    }

    // Math
    if (msg.includes('calculate') || msg.includes('math') || msg.includes('2+2')) {
      return 'Sure, I can help with calculations. For example: 2 + 2 = 4. What would you like me to calculate?';
    }

    // Time
    if (msg.includes('time') || msg.includes('date')) {
      return `The current date and time is: ${new Date().toLocaleString()}`;
    }

    // Greetings
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
      return 'Hello! How can I help you?';
    }

    // Who are you
    if (msg.includes('who are you') || msg.includes('what are you')) {
      return "I'm Joe, an AI assistant. I'm here to help you with questions, coding, explanations, and much more.";
    }

    // Default response
    return `You asked about "${userMessage}". I'm here to help with:\n\n• Answering questions\n• Writing and explaining code\n• Problem-solving\n• Information on various topics\n\nWhat would you like to know?`;
  };

  // Send message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate thinking time
    setTimeout(() => {
      const response = generateResponse(input);
      const joeMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'joe',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, joeMessage]);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="app-container">
      {/* Messages */}
      <div className="messages-container">
        {messages.map((message) => (
          <div key={message.id} className={`message message-${message.sender}`}>
            <div className="message-bubble">
              {message.text.split('\n').map((line, idx) => (
                <p key={idx}>{line || <br />}</p>
              ))}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message message-joe">
            <div className="loading-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="input-area">
        <form onSubmit={handleSendMessage} className="input-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="text-input"
            disabled={isLoading}
          />
          <button type="submit" className="send-button" disabled={isLoading || !input.trim()}>
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </div>
  );
}
