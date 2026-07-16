import { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../../api/aiApi';
import './AiChatbot.css';

const INITIAL_SUGGESTIONS = [
    'Tìm sách về văn học',
    'Sách của tác giả Nguyễn Nhật Ánh',
    'Thể loại sách nào phổ biến?',
    'Giới thiệu về thư viện',
];

const AiChatbot = () => {
    const [messages, setMessages] = useState([
        {
            author: 'assistant',
            content: 'Xin chào! Tôi là trợ lý ảo của thư viện. Tôi có thể giúp bạn tìm kiếm sách, tra cứu thông tin về tác giả, thể loại và nhiều hơn nữa. Bạn muốn hỏi gì?',
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [conversationId, setConversationId] = useState(null);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus input on mount
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSend = async (question) => {
        const text = question || input.trim();
        if (!text || isLoading) return;

        // Hide suggestions after first message
        setShowSuggestions(false);

        // Add user message
        const userMessage = { author: 'user', content: text };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // Build history for API (exclude system prompt)
        const history = messages
            .filter((m) => m.author !== 'system')
            .map((m) => ({ author: m.author, content: m.content }));

        try {
            const res = await sendChatMessage(text, conversationId, history);
            if (!conversationId && res.data.conversationId) {
                setConversationId(res.data.conversationId);
            }
            setMessages((prev) => [
                ...prev,
                { author: 'assistant', content: res.data.answer },
            ]);
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Không thể kết nối đến AI. Vui lòng thử lại sau.';
            setMessages((prev) => [
                ...prev,
                { author: 'assistant', content: `❌ ${errorMsg}` },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleSuggestionClick = (suggestion) => {
        handleSend(suggestion);
    };

    const handleNewChat = () => {
        setMessages([
            {
                author: 'assistant',
                content: 'Xin chào! Tôi là trợ lý ảo của thư viện. Tôi có thể giúp bạn tìm kiếm sách, tra cứu thông tin về tác giả, thể loại và nhiều hơn nữa. Bạn muốn hỏi gì?',
            },
        ]);
        setConversationId(null);
        setShowSuggestions(true);
        inputRef.current?.focus();
    };

    return (
        <div className="ai-chatbot-container">
            <div className="ai-chatbot-header">
                <div className="ai-chatbot-header-left">
                    <i className="bi bi-robot"></i>
                    <div>
                        <h5 className="mb-0">AI Assistant</h5>
                        <small className="text-white-50">Trợ lý thư viện thông minh</small>
                    </div>
                </div>
                <button
                    className="btn btn-sm btn-outline-light"
                    onClick={handleNewChat}
                    title="New chat"
                >
                    <i className="bi bi-plus-lg"></i>
                </button>
            </div>

            <div className="ai-chatbot-body">
                <div className="ai-chatbot-messages">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`message ${msg.author === 'user' ? 'message-user' : 'message-assistant'}`}
                        >
                            {msg.author === 'assistant' && (
                                <div className="message-avatar">
                                    <i className="bi bi-robot"></i>
                                </div>
                            )}
                            <div className="message-bubble">
                                <div className="message-content">{msg.content}</div>
                            </div>
                            {msg.author === 'user' && (
                                <div className="message-avatar user-avatar">
                                    <i className="bi bi-person"></i>
                                </div>
                            )}
                        </div>
                    ))}

                    {isLoading && (
                        <div className="message message-assistant">
                            <div className="message-avatar">
                                <i className="bi bi-robot"></i>
                            </div>
                            <div className="message-bubble">
                                <div className="typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Suggestions */}
                    {showSuggestions && !isLoading && (
                        <div className="chat-suggestions">
                            <p className="suggestions-title">Gợi ý nhanh:</p>
                            <div className="suggestions-grid">
                                {INITIAL_SUGGESTIONS.map((s, i) => (
                                    <button
                                        key={i}
                                        className="suggestion-btn"
                                        onClick={() => handleSuggestionClick(s)}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className="ai-chatbot-footer">
                <div className="input-group">
                    <input
                        ref={inputRef}
                        type="text"
                        className="form-control"
                        placeholder="Nhập câu hỏi của bạn..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                    />
                    <button
                        className="btn btn-primary"
                        onClick={() => handleSend()}
                        disabled={isLoading || !input.trim()}
                    >
                        {isLoading ? (
                            <span className="spinner-border spinner-border-sm" />
                        ) : (
                            <i className="bi bi-send"></i>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AiChatbot;
