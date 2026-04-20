import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { request, API_BASE } from '../api';
import { useAuth } from '../context/AuthContext';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs';
import { Send, Image as ImageIcon, ArrowLeft } from 'lucide-react';

export default function Chat() {
  const { txId } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const stompClient = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await request(`/chat/${txId}`, {}, token);
        setMessages(res || []);
        scrollToBottom();
      } catch (e) {
        console.error("Failed to load chat history", e);
      }
    };
    fetchHistory();

    const socket = new SockJS(`${window.location.origin}/ws-chat`);
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      onConnect: () => {
        client.subscribe(`/topic/messages/${txId}`, (msg) => {
          if(msg.body) {
            const newMsg = JSON.parse(msg.body);
            setMessages(prev => [...prev, newMsg]);
            scrollToBottom();
          }
        });
      }
    });

    client.activate();
    stompClient.current = client;

    return () => {
      if (client) client.deactivate();
    };
  }, [txId, token]);

  const scrollToBottom = () => {
    setTimeout(() => {
      if(scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, 100);
  };

  const sendMessage = () => {
    if(!input.trim() || !stompClient.current) return;
    
    const chatMessage = {
      transactionId: txId,
      senderId: user.id,
      content: input,
      timestamp: String(Date.now())
    };

    stompClient.current.publish({
      destination: '/app/chat.send',
      body: JSON.stringify(chatMessage)
    });
    
    setInput('');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if(!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const imgPath = await request('/chat/image', {
        method: 'POST',
        body: formData
      }, token);

      const chatMessage = {
        transactionId: txId,
        senderId: user.id,
        content: '[Image]',
        imageUrl: imgPath,
        timestamp: String(Date.now())
      };

      stompClient.current.publish({
        destination: '/app/chat.send',
        body: JSON.stringify(chatMessage)
      });
    } catch(err) {
      alert('Upload failed');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - var(--nav-height) - 40px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
        <button onClick={() => navigate(-1)} className="btn-ghost" style={{ padding: '8px' }}><ArrowLeft size={20}/></button>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Transaction Chat</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>ID: {txId}</p>
        </div>
      </div>

      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '24px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {messages.map((m, i) => {
          const isOwn = m.senderId === user.id;
          return (
            <div key={i} style={{ display: 'flex', justifyContent: isOwn ? 'flex-end' : 'flex-start' }}>
              <div style={{ 
                maxWidth: '70%', padding: '12px 16px', borderRadius: 'var(--radius-lg)',
                background: isOwn ? 'var(--gradient-brand)' : 'var(--bg-secondary)',
                color: isOwn ? '#fff' : 'var(--text-primary)',
                border: isOwn ? 'none' : '1px solid var(--border-subtle)',
                borderBottomRightRadius: isOwn ? '4px' : 'var(--radius-lg)',
                borderBottomLeftRadius: isOwn ? 'var(--radius-lg)' : '4px'
              }}>
                {m.imageUrl ? (
                  <img src={`${API_BASE}${m.imageUrl}`} alt="attachment" style={{ borderRadius: '8px', maxHeight: '200px' }} />
                ) : (
                  <div style={{ fontSize: '14px' }}>{m.content}</div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: '12px', background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)' }}>
        <label className="btn-ghost" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
          <ImageIcon size={20} />
        </label>
        <input 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          onKeyPress={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..." 
          style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '15px' }} 
        />
        <button onClick={sendMessage} className="btn-primary" style={{ padding: '10px', borderRadius: '50%' }}>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
