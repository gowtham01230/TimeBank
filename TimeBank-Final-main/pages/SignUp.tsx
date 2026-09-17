import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const SignUp: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { signUp } = useAuth();
    const { addNotification } = useNotification();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            addNotification('Passwords do not match.', 'error');
            return;
        }
        setLoading(true);
        try {
            await signUp(name, email, phone, password);
            addNotification('Account created successfully! Welcome.', 'success');
        } catch (error: any) {
            addNotification(error.message || 'An unknown error occurred.', 'error');
        } finally {
            setLoading(false);
        }
    };
    
    const inputClass = "appearance-none relative block w-full px-3 py-2 border border-serene-border dark:border-nocturne-border bg-serene-bg dark:bg-nocturne-bg placeholder-serene-text-subtle dark:placeholder-nocturne-text-subtle text-serene-text-main dark:text-nocturne-text-main rounded-md focus:outline-none focus:ring-2 focus:ring-serene-accent dark:focus:ring-nocturne-accent focus:border-transparent sm:text-sm transition";


    return (
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <input name="name" type="text" required value={name} onChange={e => setName(e.target.value)} className={inputClass} placeholder="Full Name" />
            <input name="email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} className={inputClass} placeholder="Email address" />
            <input name="phone" type="tel" autoComplete="tel" required value={phone} onChange={e => setPhone(e.target.value)} className={inputClass} placeholder="Phone Number" />
            <input name="password" type="password" autoComplete="new-password" required value={password} onChange={e => setPassword(e.target.value)} className={inputClass} placeholder="Password" />
            <input name="confirm-password" type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={inputClass} placeholder="Confirm Password" />

            <div>
                <button
                    type="submit"
                    disabled={loading}
                    className="group mt-4 relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-serene-accent-content dark:text-nocturne-accent-content bg-serene-accent dark:bg-nocturne-accent hover:bg-serene-accent-hover dark:hover:bg-nocturne-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-serene-panel dark:focus:ring-offset-nocturne-panel focus:ring-serene-accent dark:focus:ring-nocturne-accent disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    {loading ? 'Creating account...' : 'Create Account'}
                </button>
            </div>
        </form>
    );
};

export default SignUp;