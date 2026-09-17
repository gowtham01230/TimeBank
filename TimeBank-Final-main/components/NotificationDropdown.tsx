import React from 'react';
import { PersistentNotification } from '../types';
import { InformationCircleIcon } from './icons';

interface NotificationDropdownProps {
    notifications: PersistentNotification[];
    onClose: () => void;
    onMarkAsRead: (id: string) => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ notifications, onClose, onMarkAsRead }) => {
    
    const handleNotificationClick = (notification: PersistentNotification) => {
        if (!notification.isRead) {
            onMarkAsRead(notification._id);
        }
        onClose();
    }

    const sortedNotifications = [...notifications].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <div className="absolute right-0 mt-2 w-80 bg-serene-panel dark:bg-nocturne-panel rounded-md shadow-lg z-50 ring-1 ring-serene-border dark:ring-nocturne-border">
            <div className="p-4 border-b border-serene-border dark:border-nocturne-border">
                <h3 className="font-semibold text-serene-text-main dark:text-nocturne-text-main">Notifications</h3>
            </div>
            <ul className="max-h-96 overflow-y-auto">
                {sortedNotifications.length > 0 ? (
                    sortedNotifications.map(n => (
                        <li key={n._id} onClick={() => handleNotificationClick(n)} className={`border-b border-serene-border dark:border-nocturne-border last:border-b-0 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer ${!n.isRead ? 'bg-serene-accent/5 dark:bg-nocturne-accent/5' : ''}`}>
                            <div className="flex p-4">
                                {!n.isRead && <div className="w-2 h-2 bg-serene-accent dark:bg-nocturne-accent rounded-full mt-1.5 mr-3 flex-shrink-0"></div>}
                                <div className="flex-grow">
                                    <p className={`text-sm ${!n.isRead ? 'text-serene-text-main dark:text-nocturne-text-main' : 'text-serene-text-subtle dark:text-nocturne-text-subtle'}`}>
                                        {n.type === 'warning' && <strong className="text-warning">[WARNING] </strong>}
                                        {n.message}
                                    </p>
                                    <p className="text-xs text-serene-text-subtle/70 dark:text-nocturne-text-subtle/70 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                                </div>
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="p-8 text-center text-sm text-serene-text-subtle dark:text-nocturne-text-subtle">
                        <InformationCircleIcon className="w-8 h-8 mx-auto mb-2 text-serene-text-subtle/50 dark:text-nocturne-text-subtle/50" />
                        You have no notifications.
                    </li>
                )}
            </ul>
        </div>
    );
};

export default NotificationDropdown;