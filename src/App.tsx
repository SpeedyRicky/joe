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
  const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  const googleCx = import.meta.env.VITE_GOOGLE_CX;

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

  const buildContextualQuery = (userMessage: string, history: Message[]): string => {
    const trimmed = userMessage.trim();
    if (!trimmed) return userMessage;

    const followUpPatterns = [
      /^it\b/i,
      /^that\b/i,
      /^this\b/i,
      /^those\b/i,
      /^they\b/i,
      /^them\b/i,
      /^what about/i,
      /^how about/i,
      /^also\b/i,
      /^then\b/i,
      /^next\b/i,
      /^more\b/i,
      /^another\b/i,
      /^still\b/i,
    ];

    const isFollowUp = followUpPatterns.some((pattern) => pattern.test(trimmed)) || /\b(it|that|this|those|they|them|these|there|here)\b/i.test(trimmed);
    if (!isFollowUp || history.length < 2) {
      return userMessage;
    }

    const previousUser = [...history].reverse().find((msg) => msg.sender === 'user');
    if (!previousUser || previousUser.text.trim().toLowerCase() === trimmed.toLowerCase()) {
      return userMessage;
    }

    return `${previousUser.text} ${userMessage}`;
  };

  const buildConversationSummary = (history: Message[]): string => {
    const recentMessages = history.slice(-6);
    if (recentMessages.length === 0) return '';
    return recentMessages
      .map((msg) => `${msg.sender === 'user' ? 'You' : 'Joe'}: ${msg.text}`)
      .join('\n');
  };

  const fetchGoogleAnswer = async (query: string): Promise<string | null> => {
    if (googleApiKey && googleCx) {
      try {
        const url = `https://www.googleapis.com/customsearch/v1?key=${googleApiKey}&cx=${googleCx}&q=${encodeURIComponent(query)}&num=3`;
        const response = await fetch(url);
        if (!response.ok) return null;
        const data = await response.json();
        const items = data.items;
        if (!items || items.length === 0) return null;
        const first = items[0];
        const snippet = first.snippet?.replace(/\n/g, ' ') || '';
        const title = first.title || '';
        const link = first.link || first.formattedUrl || '';
        let answer = snippet;
        if (title) answer = `**${title}**\n\n${answer}`;
        if (link) answer += `\n\nSource: ${link}`;
        return answer;
      } catch (error) {
        // continue to no-key fallback below
      }
    }

    try {
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(
        `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`
      )}`;
      const response = await fetch(proxyUrl);
      if (!response.ok) return null;
      const proxyData = await response.json();
      const data = JSON.parse(proxyData.contents || '{}');
      const abstract = data.AbstractText || data.Abstract || '';
      const source = data.AbstractURL || `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
      if (abstract) {
        const answerText = abstract.replace(/\n/g, ' ');
        return `**Web search summary**\n\n${answerText}\n\nSource: ${source}`;
      }
      const topic = Array.isArray(data.RelatedTopics) ? data.RelatedTopics[0] : null;
      if (topic) {
        const text = typeof topic === 'string' ? topic : topic.Text || topic.FirstURL || '';
        if (text) {
          return `**Suggested result**\n\n${text}\n\nSource: ${source}`;
        }
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const generateFallbackResponse = (userMessage: string, history: Message[]): { text: string; imageUrl?: string } => {
    const summary = buildConversationSummary(history);
    const msg = userMessage.toLowerCase().trim();
    const isFollowUp = /^(it|that|this|those|they|them|what about|how about|also|then|next|more|another|still)/i.test(userMessage) || /\b(it|that|this|those|they|them|these|there|here)\b/i.test(userMessage);
    const contextPrefix = isFollowUp && summary ? `Continuing from our recent conversation:\n${summary}\n\n` : '';

    if (msg.includes('generate image') || msg.includes('create image') || msg.includes('draw') ||
        msg.includes('make image') || msg.includes('show me') || msg.includes('picture of') ||
        msg.includes('image of') || msg.includes('photo of')) {
      let subject = userMessage
        .replace(/^(generate|create|draw|make|show me)\s+(an?\s+)?image\s+of\s+/gi, '')
        .replace(/^(generate|create|draw|make)\s+(an?\s+)?picture\s+of\s+/gi, '')
        .replace(/^(generate|create|draw|make)\s+(an?\s+)?photo\s+of\s+/gi, '')
        .replace(/^(show me|give me)\s+(an?\s+)?image\s+of\s+/gi, '')
        .replace(/^(show me|give me)\s+(an?\s+)?picture\s+of\s+/gi, '')
        .replace(/^(show me|give me)\s+(an?\s+)?photo\s+of\s+/gi, '')
        .trim();

      if (!subject) {
        subject = userMessage.replace(/^(generate|create|draw|make|show me|give me)/gi, '').trim();
      }
      if (!subject) subject = 'amazing scene';

      // Check for inappropriate content
      const bannedWords = ['naked', 'nude', 'sex', 'sexy', 'porn', 'erotic', 'hot girl', 'bikini', 'lingerie'];
      if (bannedWords.some(word => subject.toLowerCase().includes(word))) {
        return {
          text: `${contextPrefix}Sorry, I can't generate images with inappropriate or explicit content. Please try a different prompt.`
        };
      }

      const imageUrl = `https://picsum.photos/512/512?random=${Date.now()}`;
      return {
        text: `${contextPrefix}Here's a random image:`,
        imageUrl,
      };
    }

    // General conversational response like ChatGPT
    const generalResponse = `${contextPrefix}As an AI assistant, I can help with that. Based on what you've asked, here's my response:\n\n"${userMessage}" is an interesting topic. I can provide information, explanations, or help with related questions. What specifically would you like to know or do?`;

    return { text: generalResponse };
  };

  const generateResponse = async (userMessage: string): Promise<{ text: string; imageUrl?: string }> => {
    const query = buildContextualQuery(userMessage, messages);
    const googleAnswer = await fetchGoogleAnswer(query);
    if (googleAnswer) {
      return { text: googleAnswer };
    }
    return generateFallbackResponse(userMessage, messages);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
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

    const response = await generateResponse(userQuery);
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
