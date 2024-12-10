import React, { useState, useEffect } from 'react';
import './PublicForum.css';

function PublicForum({ user }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const cleanup = setInterval(() => {
      const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
      setMessages(prevMessages => 
        prevMessages.filter(msg => new Date(msg.timestamp) > twoDaysAgo)
      );
    }, 1000 * 60 * 60);

    return () => clearInterval(cleanup);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        text: newMessage,
        user: user ? `${user.firstName} ${user.lastName}` : 'Anonymous',
        timestamp: new Date().toISOString(),
        avatar: user?.profilePicture || 'default-avatar.png'
      };
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  return (
    <section id="forum" className="discord-forum">
      <div className="forum-container">
        <div className="messages-area">
          <div className="messages-container">
            {messages.map(message => (
              <div key={message.id} className="discord-message">
                <div className="message-avatar">
                  <img src={message.avatar} alt={message.user} />
                </div>
                <div className="message-content">
                  <div className="message-header">
                    <span className="username">{message.user}</span>
                    <span className="timestamp">
                      {new Date(message.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="message-text">{message.text}</p>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="message-input-container">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Send a message..."
              className="message-input"
            />
            <button type="submit" className="send-button">
              Send
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default PublicForum; 