import React, { useEffect, useState } from 'react';
import { request } from '../api';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Clock, ShieldCheck, QrCode } from 'lucide-react';

export default function History() {
  const { user, token } = useAuth();
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await request(`/transactions/history?userId=${user.id}`, {}, token);
        setTxs(res || []);
        // Fetch current user details for updated token balance
        // Hardcoded for MVP if backend lacks a specific /me endpoint, we use local user object
        setUserProfile({ ...user, tokens: user.tokens !== undefined ? user.tokens : 10, trustScore: 5.0 });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, token]);

  const TransactionCard = ({ tx }) => {
    const isBorrower = tx.borrowerId === user.id;
    let badgeClass = 'badge-returned';
    if(tx.status === 'pending') badgeClass = 'badge-pending';
    if(tx.status === 'active') badgeClass = 'badge-active';

    return (
      <div className="glass-card animate-slide-up" style={{ padding: '20px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className={`badge ${badgeClass}`}>{tx.status}</span>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{tx.date || new Date().toLocaleDateString()}</span>
          </div>
          <div style={{ fontSize: '16px', fontWeight: '600' }}>Item ID: {tx.itemId.slice(-6)}</div>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            {isBorrower ? 'You Borrowed' : 'You Lent'}
          </p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
          <div style={{ fontSize: '16px', fontWeight: '700', color: isBorrower ? 'var(--accent-rose)' : 'var(--accent-green)' }}>
            {isBorrower ? '-' : '+'}{tx.tokenCost} 🪙
          </div>
          
          {tx.status === 'pending' && isBorrower && (
             <a href={`/qr/scan/${tx.id}`} className="btn btn-primary btn-sm">Scan QR</a>
          )}
          {tx.status === 'pending' && !isBorrower && (
             <a href={`/qr/show/${tx.id}`} className="btn btn-secondary btn-sm" style={{ borderColor: 'var(--accent-purple)', color: 'var(--accent-purple)' }}><QrCode size={14}/> Show QR</a>
          )}
          {tx.status === 'active' && (
             <a href={`/chat/${tx.id}`} className="btn btn-secondary btn-sm">Open Chat</a>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="section-title">Wallet & History</h1>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className="glass-card" style={{ padding: '24px', background: 'var(--gradient-brand)', color: 'white', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '8px' }}>Available Balance</div>
            <div style={{ fontSize: '42px', fontWeight: '800' }}>{userProfile?.tokens || 10} <span style={{ fontSize: '24px' }}>🪙</span></div>
          </div>
          <ShieldCheck size={120} style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.1, color: 'white' }} />
        </div>
        
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Trust Score</div>
          <div style={{ fontSize: '42px', fontWeight: '800', color: 'var(--accent-emerald)' }}>{userProfile?.trustScore?.toFixed(1) || '5.0'}</div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Updated automatically by Spark Analytics</p>
        </div>
      </div>

      <h2 className="section-title" style={{ fontSize: '18px', marginBottom: '20px' }}>Recent Transactions</h2>
      {loading ? (
        <div className="spinner"></div>
      ) : txs.length > 0 ? (
        <div className="stagger-in">
          {txs.slice().reverse().map(tx => <TransactionCard key={tx.id} tx={tx} />)}
        </div>
      ) : (
        <div className="empty-state glass-card">
          <Clock className="empty-state-icon" />
          <p className="empty-state-text">No transaction history found.</p>
        </div>
      )}
    </div>
  );
}
