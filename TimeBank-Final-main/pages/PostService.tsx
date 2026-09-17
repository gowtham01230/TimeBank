import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useNotification } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { generateServiceDescription } from '../services/geminiService';
import { SparklesIcon } from '../components/icons';

const PostService: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [timeValue, setTimeValue] = useState(1);
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);

    const { addService } = useData();
    const { addNotification } = useNotification();
    const navigate = useNavigate();

    const handleGenerateDescription = async () => {
        if (!title) {
            addNotification('Please enter a title first to generate a description.', 'info');
            return;
        }
        setAiLoading(true);
        try {
            const aiDescription = await generateServiceDescription(title);
            setDescription(aiDescription);
        } catch (error: any) {
            addNotification(error.message, 'error');
        } finally {
            setAiLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addService({ title, description, category, timeValue });
            navigate('/services');
        } catch (error: any)
{
            addNotification(error.message, 'error');
        } finally {
            setLoading(false);
        }
    };
    
    const inputClass = "w-full p-2 border border-serene-border dark:border-nocturne-border bg-serene-bg dark:bg-nocturne-bg placeholder-serene-text-subtle dark:placeholder-nocturne-text-subtle rounded-md focus:outline-none focus:ring-2 focus:ring-serene-accent dark:focus:ring-nocturne-accent focus:border-transparent transition";
    const labelClass = "block text-sm font-medium text-serene-text-subtle dark:text-nocturne-text-subtle mb-1";

    return (
        <div className="max-w-2xl mx-auto bg-serene-panel dark:bg-nocturne-panel p-8 rounded-2xl shadow-zenith-lg border border-serene-border dark:border-nocturne-border">
            <h1 className="text-3xl font-bold text-serene-text-main dark:text-nocturne-text-main mb-6">Offer a New Service</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className={labelClass}>Service Title</label>
                    <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className={inputClass} placeholder="e.g., Dog Walking for an Hour" />
                </div>
                <div>
                    <label htmlFor="description" className={labelClass}>Description</label>
                    <div className="relative">
                        <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required className={inputClass + " h-32"} placeholder="Describe what you're offering in detail." />
                        <button type="button" onClick={handleGenerateDescription} disabled={aiLoading} className="absolute top-2 right-2 flex items-center px-2 py-1 bg-serene-bg dark:bg-nocturne-bg text-serene-accent dark:text-nocturne-accent text-xs font-semibold rounded-md hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-50 transition border border-serene-border dark:border-nocturne-border">
                           <SparklesIcon className="w-4 h-4 mr-1"/> {aiLoading ? 'Generating...' : 'AI Generate'}
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="category" className={labelClass}>Category</label>
                        <input type="text" id="category" value={category} onChange={e => setCategory(e.target.value)} required className={inputClass} placeholder="e.g., Pet Care" />
                    </div>
                     <div>
                        <label htmlFor="timeValue" className={labelClass}>Time Value (hours)</label>
                        <input type="number" id="timeValue" value={timeValue} onChange={e => setTimeValue(parseFloat(e.target.value))} required min="0.25" step="0.25" className={inputClass} />
                    </div>
                </div>
                 <div>
                    <button type="submit" disabled={loading} className="w-full py-3 px-4 bg-serene-accent dark:bg-nocturne-accent text-serene-accent-content dark:text-nocturne-accent-content font-bold rounded-md hover:bg-serene-accent-hover dark:hover:bg-nocturne-accent-hover disabled:opacity-60 transition-colors">
                        {loading ? 'Posting...' : 'Post Service'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PostService;