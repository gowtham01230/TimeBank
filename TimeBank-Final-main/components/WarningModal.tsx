import React, { useState } from 'react';
import { User } from '../types';
import { motion } from 'framer-motion';

interface WarningModalProps {
    user: User;
    onClose: () => void;
    onSubmit: (userId: string, message: string) => Promise<void>;
}

const WarningModal: React.FC<WarningModalProps> = ({ user, onClose, onSubmit }) => {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;
        setLoading(true);
        await onSubmit(user.id, message);
        setLoading(false);
    };

    return (
        <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="bg-serene-panel dark:bg-nocturne-panel rounded-2xl shadow-zenith-lg p-8 max-w-lg w-full m-4 border border-serene-border dark:border-nocturne-border"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
            >
                <h2 className="text-2xl font-bold text-serene-text-main dark:text-nocturne-text-main mb-2">Send Warning</h2>
                <p className="text-serene-text-subtle dark:text-nocturne-text-subtle mb-6">Send a warning notification to <span className="font-semibold text-serene-accent dark:text-nocturne-accent">{user.name}</span>.</p>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-serene-text-subtle dark:text-nocturne-text-subtle mb-1">Warning Message</label>
                            <textarea
                                id="message"
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                rows={5}
                                required
                                className="w-full p-2 border border-serene-border dark:border-nocturne-border bg-serene-bg dark:bg-nocturne-bg placeholder-serene-text-subtle dark:placeholder-nocturne-text-subtle rounded-md focus:outline-none focus:ring-2 focus:ring-serene-accent dark:focus:ring-nocturne-accent focus:border-transparent transition"
                                placeholder={`e.g., "We have received a report regarding your recent activity..."`}
                            />
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-black/5 dark:bg-white/5 text-serene-text-subtle dark:text-nocturne-text-subtle font-semibold rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading || !message.trim()} className="px-4 py-2 bg-warning text-white font-bold rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition">
                            {loading ? 'Sending...' : 'Send Warning'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default WarningModal;