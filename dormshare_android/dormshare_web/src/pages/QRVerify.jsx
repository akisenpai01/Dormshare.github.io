import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { request } from '../api';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, ScanLine, QrCode } from 'lucide-react';

export default function QRVerify({ mode = 'show' }) {
  const { txId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (code !== txId && mode === 'scan') {
      alert('Invalid code. It must match the transaction ID.');
      return;
    }
    
    setLoading(true);
    try {
      await request(`/transactions/verify/${txId}`, { method: 'POST' }, token);
      alert('Handoff verified successfully!');
      navigate('/history');
    } catch (e) {
      alert('Failed: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
      <div className="glass-card animate-scale-in" style={{ padding: '40px', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        <button onClick={() => navigate(-1)} className="btn-ghost" style={{ position: 'absolute', top: '16px', left: '16px', padding: '8px' }}>
          <ArrowLeft size={20} />
        </button>

        {mode === 'show' ? (
          <>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'var(--gradient-brand)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#fff', boxShadow: 'var(--shadow-glow-purple)' }}>
               <QrCode size={32} />
            </div>
            <h2 style={{ fontSize: '22px', marginBottom: '8px' }}>Handoff QR Code</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '32px' }}>
              Show this code to the borrower to verify they received the item.
            </p>
            
            <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', display: 'inline-block', marginBottom: '24px' }}>
               {/* Stand-in for actual QR graphic to avoid heavy dependency array */}
               <div style={{ width: '150px', height: '150px', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <QrCode size={100} color="#fff" />
               </div>
            </div>

            <div style={{ background: 'var(--bg-glass-light)', padding: '16px', borderRadius: '12px' }}>
              <p style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Manual Code</p>
              <p style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '2px', color: 'var(--accent-indigo)' }}>{txId.slice(-6).toUpperCase()}</p>
            </div>
          </>
        ) : (
          <>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'var(--bg-tertiary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--accent-indigo)' }}>
               <ScanLine size={32} />
            </div>
            <h2 style={{ fontSize: '22px', marginBottom: '8px' }}>Scan & Verify</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '32px' }}>
              Enter the lender's verification code to complete handoff.
            </p>

            <input 
              className="input-field" 
              style={{ textAlign: 'center', fontSize: '20px', letterSpacing: '3px', fontWeight: '700', marginBottom: '24px', padding: '20px' }} 
              placeholder="ENTER CODE" 
              value={code} 
              onChange={e => setCode(e.target.value)} 
            />
            
            <button onClick={handleVerify} disabled={loading || !code} className="btn-primary btn-full" style={{ padding: '16px', fontSize: '16px' }}>
              {loading ? 'Verifying...' : 'Verify Handoff'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
