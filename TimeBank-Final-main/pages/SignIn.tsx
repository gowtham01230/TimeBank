import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { addNotification } = useNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
        addNotification("Please fill in all fields.", "error");
        return;
    }
    setLoading(true);
    try {
      await signIn(email, password);
      // No need for a success notification, redirection is enough.
    } catch (error: any) {
      addNotification(error.message || 'An unknown error occurred.', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const inputClass = "appearance-none relative block w-full px-3 py-2 border border-serene-border dark:border-nocturne-border bg-serene-bg dark:bg-nocturne-bg placeholder-serene-text-subtle dark:placeholder-nocturne-text-subtle text-serene-text-main dark:text-nocturne-text-main rounded-md focus:outline-none focus:ring-2 focus:ring-serene-accent dark:focus:ring-nocturne-accent focus:border-transparent sm:text-sm transition";

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="rounded-md shadow-sm space-y-4">
        <div>
          <label htmlFor="email-address" className="sr-only">Email address</label>
          <input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={inputClass}
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className={inputClass}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-serene-accent-content dark:text-nocturne-accent-content bg-serene-accent dark:bg-nocturne-accent hover:bg-serene-accent-hover dark:hover:bg-nocturne-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-serene-panel dark:focus:ring-offset-nocturne-panel focus:ring-serene-accent dark:focus:ring-nocturne-accent disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </div>
    </form>
  );
};

export default SignIn;