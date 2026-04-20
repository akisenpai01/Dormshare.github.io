import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { request } from '../api';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Coins, CheckCircle, Package } from 'lucide-react';

export default function ItemDetails() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        // Find item in marketplace (lazy implementation, ideally backend should have /market/item/{id})
        const res = await request(`/market/items?currentUserId=""`, {}, token);
        const found = res?.find(i => i.id === id);
        if(found) setItem(found);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, token]);

  const handleRequestBorrow = async () => {
    try {
      await request('/transactions/request', {
        method: 'POST',
        body: { itemId: id, borrowerId: user.id, lenderId: item.ownerId, tokenCost: item.tokenCost }
      }, token);
      alert('Request sent successfully! Check your history.');
      navigate('/history');
    } catch (err) {
      alert('Failed: ' + err.message);
    }
  };

  if (loading) return <div className="spinner" style={{ margin: '40px auto' }}></div>;
  if (!item) return <div className="empty-state"><Package />Item not found</div>;

  const isOwn = item.ownerId === user.id;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} className="btn-ghost" style={{ marginBottom: '24px' }}>
        <ArrowLeft size={18} /> Back
      </button>

      <div className="glass-card" style={{ padding: '32px' }}>
        <div className={`badge ${item.status === 'available' ? 'badge-available' : 'badge-pending'}`} style={{ marginBottom: '16px' }}>
          {item.status}
        </div>
        
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>{item.name}</h1>
        <p style={{ color: 'var(--accent-purple)', fontWeight: '600', fontSize: '14px', marginBottom: '24px' }}>{item.category}</p>
        
        <div style={{ background: 'var(--bg-glass)', borderRadius: 'var(--radius-lg)', padding: '20px', marginBottom: '24px' }}>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
            {item.description || 'No description provided.'}
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderTop: '1px solid var(--border-subtle)', marginBottom: '24px' }}>
           <div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pickup Location</p>
              <p style={{ fontWeight: '500' }}>{item.pickupLocation}</p>
           </div>
           <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Cost / Day</p>
              <p style={{ fontWeight: '800', fontSize: '24px', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {item.tokenCost} <Coins size={20} />
              </p>
           </div>
        </div>

        {item.status === 'available' && !isOwn && (
          <button onClick={handleRequestBorrow} className="btn-primary btn-full" style={{ padding: '16px', fontSize: '16px' }}>
             Request to Borrow
          </button>
        )}
        
        {item.status !== 'available' && (
           <div className="alert alert-info">
              <CheckCircle size={18} /> This item is currently {item.status}.
           </div>
        )}
      </div>
    </div>
  );
}
