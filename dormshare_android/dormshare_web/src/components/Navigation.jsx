import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Store, Clock, LogOut, BookOpen, Plus, UserCircle } from 'lucide-react';
import { request } from '../api';

export default function Navigation({ children }) {
  const { user, token, Object: authActions } = useAuth();
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [addItemData, setAddItemData] = useState({ name: '', category: 'General', tokenCost: 1, pickupLocation: '', description: '' });

  const handleLogout = () => {
    authActions.logout();
    navigate('/auth');
  };

  const submitItem = async (e) => {
    e.preventDefault();
    try {
      await request('/market/add', {
        method: 'POST',
        body: { ...addItemData, ownerId: user.id }
      }, token);
      setShowAddModal(false);
      window.location.reload(); // Quick refresh for MVP
    } catch (err) {
      alert(err.message);
    }
  };

  if (!user) return <>{children}</>;

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 'var(--nav-height)',
        background: 'rgba(10, 10, 15, 0.8)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '18px', fontWeight: '700' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <BookOpen size={16} />
          </div>
          DormShare
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>
             <UserCircle size={18}/> {user.name}
          </div>
          <button onClick={handleLogout} className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <LogOut size={16} /> <span className="hide-mobile">Logout</span>
          </button>
        </div>
      </nav>

      <div className="page-container dashboard-grid">
        <aside style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <NavLink to="/" className={({isActive}) => `btn ${isActive ? 'btn-secondary' : 'btn-ghost'}`} style={{ justifyContent: 'flex-start' }}>
            <Store size={18} /> Marketplace
          </NavLink>
          <NavLink to="/history" className={({isActive}) => `btn ${isActive ? 'btn-secondary' : 'btn-ghost'}`} style={{ justifyContent: 'flex-start' }}>
            <Clock size={18} /> History & Wallet
          </NavLink>
          
          <div style={{ marginTop: '24px' }}>
            <button onClick={() => setShowAddModal(true)} className="btn btn-primary btn-full">
              <Plus size={18} /> Lend an Item
            </button>
          </div>
        </aside>

        <main>{children}</main>
      </div>

      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div className="glass-card animate-scale-in" style={{ padding: '32px', width: '100%', maxWidth: '400px' }}>
            <h3 style={{ marginBottom: '24px', fontSize: '20px' }}>List an Item</h3>
            <form onSubmit={submitItem} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input required className="input-field" placeholder="Item Name" value={addItemData.name} onChange={e => setAddItemData({...addItemData, name: e.target.value})} />
              <div style={{ display: 'flex', gap: '12px' }}>
                <input required type="number" min="1" className="input-field" placeholder="Token Cost/Day" value={addItemData.tokenCost} onChange={e => setAddItemData({...addItemData, tokenCost: parseInt(e.target.value)})} />
                <input required className="input-field" placeholder="Category" value={addItemData.category} onChange={e => setAddItemData({...addItemData, category: e.target.value})} />
              </div>
              <input required className="input-field" placeholder="Pickup Location (e.g. Block B, Room 201)" value={addItemData.pickupLocation} onChange={e => setAddItemData({...addItemData, pickupLocation: e.target.value})} />
              <textarea className="input-field" placeholder="Description..." rows="3" value={addItemData.description} onChange={e => setAddItemData({...addItemData, description: e.target.value})} />
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Publish</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
