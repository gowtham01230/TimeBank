import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { User } from '../types';
import { useNotification } from '../context/NotificationContext';
import { SelectorIcon, ChevronUpIcon, ChevronDownIcon } from '../components/icons';
import WarningModal from '../components/WarningModal';

type SortKey = 'name' | 'email' | 'timeBalance';
type SortDirection = 'asc' | 'desc';

const AdminDashboard: React.FC = () => {
    const { users, getUsers, updateAnyUser, sendWarning, loading: authLoading } = useAuth();
    const [pageLoading, setPageLoading] = useState(true);
    const { addNotification } = useNotification();
    const [filter, setFilter] = useState('All');
    const [sortKey, setSortKey] = useState<SortKey>('name');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [warningUser, setWarningUser] = useState<User | null>(null);

    useEffect(() => {
        getUsers().finally(() => setPageLoading(false));
    }, [getUsers]);

    const handleStatusChange = async (user: User, newStatus: 'active' | 'suspended') => {
        if (user.status === newStatus) return;
        try {
            await updateAnyUser(user.id, { status: newStatus });
            addNotification(`User ${user.name}'s status updated to ${newStatus}.`, 'success');
        } catch (error: any) {
            addNotification(error.message, 'error');
        }
    };
    
    const handleBalanceChange = async (user: User, newBalance: number) => {
        if (isNaN(newBalance) || user.timeBalance === newBalance) return;
        try {
            await updateAnyUser(user.id, { timeBalance: newBalance });
            addNotification(`User ${user.name}'s time balance updated.`, 'success');
        } catch (error: any) {
            addNotification(error.message, 'error');
        }
    }
    
    const handleSendWarning = async (userId: string, message: string) => {
        try {
            await sendWarning(userId, message);
            addNotification(`Warning sent successfully to user.`, 'success');
            setWarningUser(null);
        } catch (error: any) {
            addNotification(error.message, 'error');
        }
    };

    const sortedAndFilteredUsers = useMemo(() => {
        let filtered = [...users];
        if (filter !== 'All') {
            if (filter === 'Admin') {
                filtered = filtered.filter(u => u.role === 'admin');
            } else {
                 filtered = filtered.filter(u => u.status === filter.toLowerCase());
            }
        }

        return filtered.sort((a, b) => {
            const valA = a[sortKey];
            const valB = b[sortKey];
            if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }, [users, filter, sortKey, sortDirection]);

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    const SortableHeader: React.FC<{ sortKeyName: SortKey, children: React.ReactNode }> = ({ sortKeyName, children }) => (
        <th scope="col" onClick={() => handleSort(sortKeyName)} className="px-6 py-3 text-left text-xs font-medium text-serene-text-subtle dark:text-nocturne-text-subtle uppercase tracking-wider cursor-pointer">
            <div className="flex items-center">
                {children}
                {sortKey === sortKeyName 
                    ? (sortDirection === 'asc' ? <ChevronUpIcon className="w-4 h-4 ml-1" /> : <ChevronDownIcon className="w-4 h-4 ml-1" />)
                    : <SelectorIcon className="w-4 h-4 ml-1 opacity-50" />
                }
            </div>
        </th>
    );


    if (pageLoading || authLoading) {
        return <div className="text-center p-8 animate-pulse text-serene-text-subtle dark:text-nocturne-text-subtle">Loading admin data...</div>;
    }

    const filterButtons = ['All', 'Active', 'Suspended', 'Admin'];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-serene-text-main dark:text-nocturne-text-main">Admin Dashboard</h1>
            
            <div className="flex space-x-2 p-1 bg-serene-bg dark:bg-nocturne-bg rounded-lg border border-serene-border dark:border-nocturne-border">
                {filterButtons.map(f => (
                    <button key={f} onClick={() => setFilter(f)} className={`w-full py-2 text-sm font-semibold rounded-md transition ${filter === f ? 'bg-serene-panel dark:bg-nocturne-panel shadow-sm text-serene-text-main dark:text-nocturne-text-main' : 'text-serene-text-subtle dark:text-nocturne-text-subtle hover:bg-serene-panel/50 dark:hover:bg-nocturne-panel/50'}`}>
                        {f}
                    </button>
                ))}
            </div>

            <div className="bg-serene-panel dark:bg-nocturne-panel shadow-zenith-lg rounded-2xl overflow-x-auto border border-serene-border dark:border-nocturne-border">
                <table className="min-w-full divide-y divide-serene-border dark:divide-nocturne-border">
                    <thead className="bg-serene-bg dark:bg-nocturne-panel/50">
                        <tr>
                            <SortableHeader sortKeyName="name">User</SortableHeader>
                            <SortableHeader sortKeyName="email">Contact</SortableHeader>
                            <SortableHeader sortKeyName="timeBalance">Time Balance</SortableHeader>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-serene-text-subtle dark:text-nocturne-text-subtle uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-serene-text-subtle dark:text-nocturne-text-subtle uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-serene-border dark:divide-nocturne-border">
                        {sortedAndFilteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-serene-bg dark:hover:bg-nocturne-bg/30 transition">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img className="h-10 w-10 rounded-full ring-2 ring-serene-border dark:ring-nocturne-border" src={user.profilePhoto} alt="" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-serene-text-main dark:text-nocturne-text-main">{user.name}</div>
                                            <div className="text-sm text-serene-text-subtle dark:text-nocturne-text-subtle">{user.role}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-serene-text-main dark:text-nocturne-text-main">{user.email}</div>
                                    <div className="text-sm text-serene-text-subtle dark:text-nocturne-text-subtle">{user.phone}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <input type="number"
                                           defaultValue={user.timeBalance.toFixed(2)}
                                           step="0.1"
                                           onBlur={(e) => handleBalanceChange(user, parseFloat(e.target.value))}
                                           className="w-24 p-1 border border-serene-border dark:border-nocturne-border bg-serene-bg dark:bg-nocturne-bg text-serene-text-main dark:text-nocturne-text-main rounded"
                                           disabled={user.role === 'admin'} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        user.status === 'active' ? 'bg-green-500/10 text-green-500 dark:text-green-400' : 'bg-red-500/10 text-red-500 dark:text-red-400'
                                    }`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                                    {user.role !== 'admin' && (
                                        <>
                                            {user.status === 'active' ? (
                                                <button onClick={() => handleStatusChange(user, 'suspended')} className="text-red-500 hover:text-red-600">Suspend</button>
                                            ) : (
                                                <button onClick={() => handleStatusChange(user, 'active')} className="text-green-500 hover:text-green-600">Activate</button>
                                            )}
                                            <button onClick={() => setWarningUser(user)} className="text-yellow-500 hover:text-yellow-600">Warn</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {warningUser && (
                <WarningModal
                    user={warningUser}
                    onClose={() => setWarningUser(null)}
                    onSubmit={handleSendWarning}
                />
            )}
        </div>
    );
};

export default AdminDashboard;