import React, { useEffect, useState } from 'react';
import { request } from '../api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Package, MapPin, Coins } from 'lucide-react';

export default function Dashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [myItems, setMyItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarket = async () => {
      try {
        const res = await request(`/market/items?currentUserId=${user.id}`, {}, token);
        setItems(res || []);
        
        try {
            const myRes = await request(`/market/my-items?userId=${user.id}`, {}, token);
            setMyItems(myRes || []);
        } catch(e) {}
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchMarket();
  }, [user.id, token]);

  const ItemCard = ({ item, isOwn }) => (
    <div className="glass-card animate-fade-in" style={{ padding: '20px', cursor: 'pointer', position: 'relative' }} onClick={() => navigate(`/item/${item.id}`)}>
      <div className={`badge ${item.status === 'available' ? 'badge-available' : (item.status === 'pending' ? 'badge-pending' : 'badge-borrowed')}`} style={{ marginBottom: '12px' }}>
        {item.status}
      </div>
      <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>{item.name}</h3>
      <p style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
        <MapPin size={14} /> {item.pickupLocation}
      </p>
      
      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-amber)', fontWeight: '600' }}>
          <Coins size={16} /> {item.tokenCost}
        </div>
        {isOwn && item.status === 'pending' && (
           <span style={{ fontSize: '12px', color: 'var(--accent-purple)', fontWeight: '600' }}>Requires Action</span>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="section-title">Campus Market</h1>
          <p className="section-subtitle">Borrow essentials securely on campus</p>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><div className="spinner"></div></div>
      ) : items.length > 0 ? (
        <div className="items-grid stagger-in">
          {items.map(item => <ItemCard key={item.id} item={item} />)}
        </div>
      ) : (
        <div className="empty-state glass-card">
          <Package className="empty-state-icon" />
          <p className="empty-state-text">The market is currently empty. Be the first to lend an item to your dorm!</p>
        </div>
      )}

      {myItems.length > 0 && (
        <div style={{ marginTop: '48px' }}>
          <h2 className="section-title" style={{ marginBottom: '24px' }}>My Listings</h2>
          <div className="items-grid stagger-in">
            {myItems.map(item => <ItemCard key={item.id} item={item} isOwn={true} />)}
          </div>
        </div>
      )}
    </div>
  );
}
