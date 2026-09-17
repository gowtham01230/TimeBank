import React from 'react';
import { useNotification } from '../context/NotificationContext';
import { Notification } from '../types';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, XMarkIcon } from './icons';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationItem: React.FC<{ notification: Notification; onRemove: (id: string) => void }> = ({ notification, onRemove }) => {
    const typeStyles = {
        success: {
            bg: 'bg-green-500/10 border-green-500/20',
            icon: <CheckCircleIcon className="w-6 h-6 text-green-500" />,
        },
        error: {
            bg: 'bg-red-500/10 border-red-500/20',
            icon: <XCircleIcon className="w-6 h-6 text-red-500" />,
        },
        info: {
            bg: 'bg-serene-accent/10 dark:bg-nocturne-accent/10 border-serene-accent/20 dark:border-nocturne-accent/20',
            icon: <InformationCircleIcon className="w-6 h-6 text-serene-accent dark:text-nocturne-accent" />,
        },
    };
    
    const styles = typeStyles[notification.type];

    return (
        <motion.div 
            layout
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className={`relative w-full max-w-sm p-4 mb-4 rounded-xl shadow-zenith-lg flex items-start justify-between border bg-serene-panel/80 dark:bg-nocturne-panel/80 backdrop-blur-lg ${styles.bg}`}>
            <div className="flex items-start">
                <div className="flex-shrink-0">{styles.icon}</div>
                <div className="ml-3">
                    <p className="text-sm font-medium text-serene-text-main dark:text-nocturne-text-main">{notification.message}</p>
                </div>
            </div>
            <button onClick={() => onRemove(notification.id)} className="ml-4 p-1 rounded-full text-serene-text-subtle dark:text-nocturne-text-subtle hover:bg-black/10 dark:hover:bg-white/10">
                <XMarkIcon className="w-5 h-5" />
            </button>
        </motion.div>
    );
};


const NotificationToast: React.FC = () => {
    const { notifications, removeNotification } = useNotification();

    return (
        <div className="fixed bottom-5 right-5 z-50">
            <AnimatePresence>
                {notifications.map(notification => (
                    <NotificationItem key={notification.id} notification={notification} onRemove={removeNotification} />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default NotificationToast;