import React, { useState } from 'react';
import { Job, Feedback } from '../types';
import StarRating from './StarRating';
import { useNotification } from '../context/NotificationContext';
import { motion } from 'framer-motion';

interface FeedbackModalProps {
    job: Job;
    onClose: () => void;
    onSubmit: (feedbackData: Omit<Feedback, 'id' | 'createdAt' | 'fromUserId' | 'fromUserName' | 'toUserId' | 'toUserName'>) => Promise<void>;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ job, onClose, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const { addNotification } = useNotification();
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            addNotification('Please provide a rating.', 'error');
            return;
        }
        setLoading(true);
        try {
            await onSubmit({ jobId: job.id, rating, comment });
            onClose();
        } catch (error: any) {
             addNotification(error.message, 'error');
        } finally {
            setLoading(false);
        }
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
                <h2 className="text-2xl font-bold text-serene-text-main dark:text-nocturne-text-main mb-2">Leave Feedback</h2>
                <p className="text-serene-text-subtle dark:text-nocturne-text-subtle mb-6">How was your experience with: <span className="font-semibold text-serene-accent dark:text-nocturne-accent">{job.serviceTitle}</span>?</p>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-serene-text-subtle dark:text-nocturne-text-subtle mb-2">Your Rating</label>
                            <div className="flex">
                                <StarRating value={rating} onChange={setRating} size={36} />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="comment" className="block text-sm font-medium text-serene-text-subtle dark:text-nocturne-text-subtle mb-1">Your Comments (optional)</label>
                            <textarea
                                id="comment"
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                                rows={4}
                                className="w-full p-2 border border-serene-border dark:border-nocturne-border bg-serene-bg dark:bg-nocturne-bg placeholder-serene-text-subtle dark:placeholder-nocturne-text-subtle rounded-md focus:outline-none focus:ring-2 focus:ring-serene-accent dark:focus:ring-nocturne-accent focus:border-transparent transition"
                                placeholder="Share more details about your experience..."
                            />
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-black/5 dark:bg-white/5 text-serene-text-subtle dark:text-nocturne-text-subtle font-semibold rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="px-4 py-2 bg-serene-accent dark:bg-nocturne-accent text-serene-accent-content dark:text-nocturne-accent-content font-bold rounded-md hover:bg-serene-accent-hover dark:hover:bg-nocturne-accent-hover disabled:opacity-60 transition">
                            {loading ? 'Submitting...' : 'Submit Feedback'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default FeedbackModal;