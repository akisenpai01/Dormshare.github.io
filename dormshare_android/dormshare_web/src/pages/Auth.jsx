import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { request } from '../api';
import { useNavigate } from 'react-router-dom';
import { BookOpen, User, Lock, Mail, Home } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const { Object: authActions } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    hostelBlock: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const res = await request('/auth/signin', {
          method: 'POST',
          body: { email: formData.email, password: formData.password }
        });
        authActions.login({ id: res.userId, name: res.name }, res.token);
        navigate('/');
      } else {
        await request('/auth/signup', {
          method: 'POST',
          body: formData
        });
        setIsLogin(true); // Switch to login view after successful register
        setError('Registration successful! Please sign in.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div className="glass-card animate-scale-in" style={{ padding: '40px', maxWidth: '440px', width: '100%', position: 'relative', overflow: 'hidden' }}>
        
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '250px', height: '250px', background: 'var(--accent-indigo)', filter: 'blur(100px)', opacity: '0.15', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '250px', height: '250px', background: 'var(--accent-purple)', filter: 'blur(100px)', opacity: '0.15', borderRadius: '50%' }}></div>

        <div style={{ textAlign: 'center', marginBottom: '32px', position: 'relative', zIndex: 1 }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--gradient-brand)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', color: 'white', boxShadow: 'var(--shadow-glow-indigo)' }}>
            <BookOpen size={24} />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>DormShare</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Hyperlocal Campus Network</p>
        </div>

        {error && (
            <div className={`alert ${error.includes('successful') ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: '20px' }}>
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', zIndex: 1 }}>
          {!isLogin && (
            <>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '16px', top: '15px', color: 'var(--text-muted)' }} />
                <input required className="input-field" style={{ paddingLeft: '44px' }} placeholder="Full Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div style={{ position: 'relative' }}>
                <Home size={18} style={{ position: 'absolute', left: '16px', top: '15px', color: 'var(--text-muted)' }} />
                <input required className="input-field" style={{ paddingLeft: '44px' }} placeholder="Hostel Block (e.g. Block A)" value={formData.hostelBlock} onChange={e => setFormData({ ...formData, hostelBlock: e.target.value })} />
              </div>
            </>
          )}

          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '16px', top: '15px', color: 'var(--text-muted)' }} />
            <input required type="email" className="input-field" style={{ paddingLeft: '44px' }} placeholder="Email (@stu.upes.ac.in)" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '16px', top: '15px', color: 'var(--text-muted)' }} />
            <input required type="password" className="input-field" style={{ paddingLeft: '44px' }} placeholder="Password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary btn-full" style={{ marginTop: '8px' }}>
            {loading ? <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></div> : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'var(--text-secondary)', position: 'relative', zIndex: 1 }}>
          {isLogin ? "New to DormShare?" : "Already have an account?"}
          <button onClick={() => setIsLogin(!isLogin)} style={{ color: 'var(--accent-indigo)', fontWeight: '600', marginLeft: '6px' }}>
            {isLogin ? "Join Campus Network" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}
