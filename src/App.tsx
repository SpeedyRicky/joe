import { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaPlus, FaTrash, FaImage } from 'react-icons/fa';
import './App.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'joe';
  timestamp: Date;
  imageUrl?: string;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

export default function App() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string>('');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chats from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('joe-chats');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const restored = parsed.map((chat: any) => ({
          ...chat,
          messages: chat.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
          createdAt: new Date(chat.createdAt),
        }));
        setChats(restored);
        if (restored.length > 0) {
          setCurrentChatId(restored[0].id);
        }
      } catch (e) {
        createNewChat();
      }
    } else {
      createNewChat();
    }
  }, []);

  // Save chats to localStorage
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem('joe-chats', JSON.stringify(chats));
    }
  }, [chats]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, currentChatId]);

  const currentChat = chats.find((c) => c.id === currentChatId);
  const messages = currentChat?.messages || [];

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
    };
    setChats((prev) => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
  };

  const deleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setChats((prev) => prev.filter((c) => c.id !== id));
    if (currentChatId === id) {
      if (chats.length > 1) {
        const nextChat = chats.find((c) => c.id !== id);
        setCurrentChatId(nextChat?.id || '');
      } else {
        createNewChat();
      }
    }
  };

  const generateResponse = (userMessage: string): { text: string; imageUrl?: string } => {
    const msg = userMessage.toLowerCase();

    if (msg.includes('generate image') || msg.includes('create image') || msg.includes('draw')) {
      // Use a working placeholder image service
      const timestamp = Date.now();
      const imageUrl = `https://picsum.photos/600/400?random=${timestamp}`;
      return {
        text: 'Here\'s a generated image for you:',
        imageUrl: imageUrl,
      };
    }

    if (msg.includes('code') || msg.includes('javascript') || msg.includes('python') || msg.includes('react')) {
      return {
        text: `Here's a JavaScript example:\n\nconst greet = (name) => {\n  console.log(\`Hello, \${name}!\`);\n};\n\ngreet('World');\n\nThis function takes a parameter and logs a greeting to the console.`,
      };
    }

    if (msg.includes('calculate') || msg.includes('math')) {
      return { text: 'Sure, I can help with calculations. For example: 2 + 2 = 4. What would you like me to calculate?' };
    }

    if (msg.includes('time') || msg.includes('date')) {
      return { text: `The current date and time is: ${new Date().toLocaleString()}` };
    }

    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
      return { text: 'Hello! How can I help you?' };
    }

    if (msg.includes('who are you') || msg.includes('what are you')) {
      return { text: "I'm Joe, an AI assistant. I can help with questions, coding, image generation, and much more. What would you like to know?" };
    }

    return {
      text: `You asked about "${userMessage}". I'm here to help with:\n\n• Answering questions\n• Writing and explaining code\n• Problem-solving\n• Information on various topics\n\nWhat would you like to know?`,
    };
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !currentChat) return;

    const userQuery = input;
    const userMessage: Message = {
      id: Date.now().toString(),
      text: userQuery,
      sender: 'user',
      timestamp: new Date(),
    };

    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === currentChatId) {
          const updated = { ...chat, messages: [...chat.messages, userMessage] };
          if (chat.messages.length === 0) {
            updated.title = userQuery.slice(0, 30) + (userQuery.length > 30 ? '...' : '');
          }
          return updated;
        }
        return chat;
      })
    );

    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const response = generateResponse(userQuery);
      const joeMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: 'joe',
        timestamp: new Date(),
        imageUrl: response.imageUrl,
      };

      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id === currentChatId) {
            return { ...chat, messages: [...chat.messages, joeMessage] };
          }
          return chat;
        })
      );

      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <button className="new-chat-btn" onClick={createNewChat}>
            <FaPlus /> New Chat
          </button>
        </div>

        <div className="chats-list">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`chat-item ${currentChatId === chat.id ? 'active' : ''}`}
              onClick={() => setCurrentChatId(chat.id)}
            >
              <span className="chat-title">{chat.title}</span>
              <button
                className="delete-btn"
                onClick={(e) => deleteChat(chat.id, e)}
                title="Delete chat"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-main">
        {/* Messages */}
        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="welcome-message">
              <h1>Joe</h1>
              <p>Start a new conversation</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`message message-${message.sender}`}>
                <div className="message-bubble">
                  {message.text.split('\n').map((line, idx) => (
                    <p key={idx}>{line || <br />}</p>
                  ))}
                  {message.imageUrl && (
                    <img src={message.imageUrl} alt="Generated" className="message-image" />
                  )}
                </div>
              </div>
            ))
          )}
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
            <div className="input-wrapper">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message Joe..."
                className="text-input"
                disabled={isLoading}
              />
              <button
                type="button"
                className="image-btn"
                title="Generate image"
                onClick={() => setInput('Generate image of a')}
                disabled={isLoading}
              >
                <FaImage />
              </button>
              <button type="submit" className="send-button" disabled={isLoading || !input.trim()}>
                <FaPaperPlane />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Toggle */}
      <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        ☰
      </button>
    </div>
  );
}
