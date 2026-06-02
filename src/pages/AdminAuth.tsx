import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowRight, Loader2 } from 'lucide-react';

export function AdminAuth() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // If already logged in, redirect
  if (localStorage.getItem('admin_token')) {
    navigate('/admin/dashboard');
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success) {
          localStorage.setItem('admin_token', data.token);
          navigate('/admin/dashboard');
        } else {
          setError(data.message || 'Invalid credentials');
        }
      } else {
        const text = await res.text();
        console.error('Non-JSON response:', text);
        setError(`Server returned non-JSON. See console. Status: ${res.status}`);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(`Connection error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 animate-in slide-in-from-bottom-4 duration-500 [perspective:1000px]">
      <div className="bg-white pt-8 pb-10 px-8 rounded-[2rem] shadow-2xl border-2 border-slate-200 border-b-[12px] border-b-slate-300 text-center transform transition-all hover:rotateX-2 hover:-translate-y-2">
        <div className="mx-auto w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-md border-2 border-blue-200 border-b-[6px] transform hover:scale-110 transition-transform">
          <ShieldAlert size={36} />
        </div>
        
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Admin Access</h2>
        <p className="text-slate-500 mb-8 font-medium">Secure area for content management</p>
        
        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5 text-left">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              required
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 border-b-4 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-colors font-medium text-lg placeholder:text-slate-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 border-b-4 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-colors font-medium text-lg placeholder:text-slate-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-bold py-4 px-4 rounded-xl border-2 border-slate-950 border-b-[6px] active:border-b-2 active:translate-y-[4px] hover:-translate-y-1 transition-all mt-8 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <span>Secure Login</span>}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>
      </div>
    </div>
  );
}
