import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { toast } from 'react-hot-toast';

function ContactPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [subject, setSubject] = useState('');
  const socketRef = useRef();
  const messagesEndRef = useRef(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    socketRef.current = io('http://localhost:5000');
    
    // Join user's room
    socketRef.current.emit('join', 'user_id'); // Replace with actual user ID

    // Listen for new messages
    socketRef.current.on('new_message', (message) => {
      setMessages(prev => [...prev, message]);
      // Show notification for new messages
      if (message.user_id !== 'user_id') { // Don't notify for own messages
        toast.success('New message from coach!', {
          duration: 3000,
          position: 'top-right'
        });
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      user_id: 'user_id', // Replace with actual user ID
      subject: subject,
      message: newMessage,
      timestamp: new Date()
    };

    try {
      // Emit message through socket
      socketRef.current.emit('send_message', messageData);

      // Clear form
      setNewMessage('');
      setSubject('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Contact Coach</h1>

        {/* Message Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., Question about training schedule"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Type your message here..."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Message History */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Message History</h2>
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg._id} className="border-b border-gray-200 pb-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{msg.subject}</h3>
                  <span className="text-sm text-gray-500">
                    {new Date(msg.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-600">{msg.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add scroll reference */}
      <div ref={messagesEndRef} />
      
      {/* Add notification badge for unread messages */}
      {messages.some(msg => !msg.read) && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full">
          New messages!
        </div>
      )}
    </div>
  );
}

export default ContactPage; 