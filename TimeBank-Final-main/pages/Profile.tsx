import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User } from '../types';
import { useNotification } from '../context/NotificationContext';
import { CameraIcon, MailIcon, PhoneIcon, PencilIcon } from '../components/icons';

const Profile: React.FC = () => {
    const { user, updateUser } = useAuth();
    const { addNotification } = useNotification();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<User>>(user || {});
    const [loading, setLoading] = useState(false);

    if (!user) {
        return <div className="text-center p-8 animate-pulse text-serene-text-subtle dark:text-nocturne-text-subtle">Loading profile...</div>;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, skills: e.target.value.split(',').map(s => s.trim()) });
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            updateUser(formData);
            addNotification('Profile updated successfully!', 'success');
            setIsEditing(false);
        } catch (error: any) {
            addNotification(error.message || 'Failed to update profile.', 'error');
        } finally {
            setLoading(false);
        }
    };
    
    const inputClass = "w-full p-2 border border-serene-border dark:border-nocturne-border bg-serene-bg dark:bg-nocturne-bg placeholder-serene-text-subtle dark:placeholder-nocturne-text-subtle rounded-md focus:outline-none focus:ring-2 focus:ring-serene-accent dark:focus:ring-nocturne-accent focus:border-transparent transition";
    const infoClass = "mt-1 text-lg text-serene-text-main dark:text-nocturne-text-main";

    return (
        <div className="max-w-4xl mx-auto bg-serene-panel dark:bg-nocturne-panel p-8 rounded-2xl shadow-zenith-lg border border-serene-border dark:border-nocturne-border">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
                <div className="relative">
                    <img src={user.profilePhoto} alt={user.name} className="h-32 w-32 rounded-full object-cover ring-4 ring-serene-bg dark:ring-nocturne-bg" />
                    <button className="absolute bottom-1 right-1 bg-serene-panel dark:bg-nocturne-panel p-2 rounded-full shadow-md hover:bg-serene-border dark:hover:bg-nocturne-border border border-serene-border dark:border-nocturne-border">
                        <CameraIcon className="w-5 h-5 text-serene-text-subtle dark:text-nocturne-text-subtle" />
                    </button>
                </div>
                <div className="flex-grow text-center md:text-left">
                    <h1 className="text-3xl font-bold text-serene-text-main dark:text-nocturne-text-main">{user.name}</h1>
                    <div className="flex items-center justify-center md:justify-start space-x-4 mt-2 text-serene-text-subtle dark:text-nocturne-text-subtle">
                        <span className="flex items-center"><MailIcon className="w-5 h-5 mr-2" />{user.email}</span>
                        <span className="flex items-center"><PhoneIcon className="w-5 h-5 mr-2" />{user.phone}</span>
                    </div>
                </div>
                <button onClick={() => { setIsEditing(!isEditing); setFormData(user); }} className="flex items-center px-4 py-2 bg-serene-bg dark:bg-nocturne-panel text-serene-text-subtle dark:text-nocturne-text-subtle font-semibold rounded-md hover:bg-black/5 dark:hover:bg-white/5 hover:text-serene-text-main dark:hover:text-nocturne-text-main border border-serene-border dark:border-nocturne-border transition">
                    <PencilIcon className="w-4 h-4 mr-2" />
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
            </div>
            
            <div className="mt-8 border-t border-serene-border dark:border-nocturne-border pt-8">
                {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-serene-text-subtle dark:text-nocturne-text-subtle">Full Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className={inputClass} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-serene-text-subtle dark:text-nocturne-text-subtle">Phone</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className={inputClass} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-serene-text-subtle dark:text-nocturne-text-subtle">Skills (comma-separated)</label>
                            <input type="text" name="skills" defaultValue={user.skills?.join(', ')} onChange={handleSkillsChange} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-serene-text-subtle dark:text-nocturne-text-subtle">Available Hours</label>
                            <input type="text" name="availableHours" value={formData.availableHours} onChange={handleInputChange} className={inputClass} />
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" disabled={loading} className="px-6 py-2 bg-serene-accent dark:bg-nocturne-accent text-serene-accent-content dark:text-nocturne-accent-content font-bold rounded-md hover:bg-serene-accent-hover dark:hover:bg-nocturne-accent-hover disabled:opacity-60">
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-4">
                         <div>
                            <h3 className="text-sm font-medium text-serene-text-subtle dark:text-nocturne-text-subtle">Skills</h3>
                            <p className={infoClass}>{user.skills && user.skills.length > 0 ? user.skills.join(', ') : 'No skills listed.'}</p>
                        </div>
                         <div>
                            <h3 className="text-sm font-medium text-serene-text-subtle dark:text-nocturne-text-subtle">Available Hours</h3>
                            <p className={infoClass}>{user.availableHours}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;