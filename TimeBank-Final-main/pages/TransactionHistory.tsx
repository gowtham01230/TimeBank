import React from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { ArrowUpIcon, ArrowDownIcon } from '../components/icons';
import { motion } from 'framer-motion';

const TransactionHistory: React.FC = () => {
    const { transactions, loading } = useData();
    const { user } = useAuth();

    if (loading) {
        return <div className="text-center p-8 animate-pulse text-serene-text-subtle dark:text-nocturne-text-subtle">Loading transaction history...</div>;
    }

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.05,
        },
      },
    };
    
    const itemVariants = {
      hidden: { y: 20, opacity: 0 },
      visible: { y: 0, opacity: 1 },
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-serene-text-main dark:text-nocturne-text-main">Transaction History</h1>
            <div className="bg-serene-panel dark:bg-nocturne-panel shadow-zenith-lg rounded-2xl border border-serene-border dark:border-nocturne-border">
                <motion.ul 
                    className="divide-y divide-serene-border dark:divide-nocturne-border"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {transactions.length > 0 ? (
                        transactions.map(tx => {
                            const isOutgoing = tx.fromUserId === user?.id;
                            return (
                                <motion.li 
                                    key={tx.id} 
                                    className="p-4 md:p-6 flex items-center justify-between"
                                    variants={itemVariants}
                                >
                                    <div className="flex items-center">
                                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 ${isOutgoing ? 'bg-red-500/10' : 'bg-green-500/10'}`}>
                                            {isOutgoing ? <ArrowUpIcon className="w-5 h-5 text-red-500" /> : <ArrowDownIcon className="w-5 h-5 text-green-500" />}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-serene-text-main dark:text-nocturne-text-main">{tx.jobTitle}</p>
                                            <p className="text-sm text-serene-text-subtle dark:text-nocturne-text-subtle">
                                                {isOutgoing ? `To: ${tx.toUserName}` : `From: ${tx.fromUserName}`}
                                            </p>
                                            <p className="text-xs text-serene-text-subtle/70 dark:text-nocturne-text-subtle/70 md:hidden">
                                                {new Date(tx.timestamp).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-bold text-lg ${isOutgoing ? 'text-red-500' : 'text-green-500'}`}>
                                            {isOutgoing ? '-' : '+'} {tx.amount.toFixed(2)} hrs
                                        </p>
                                        <p className="text-sm text-serene-text-subtle/70 dark:text-nocturne-text-subtle/70 hidden md:block">
                                            {new Date(tx.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                </motion.li>
                            )
                        })
                    ) : (
                        <li className="p-8 text-center text-serene-text-subtle dark:text-nocturne-text-subtle">
                            You have no transactions yet.
                        </li>
                    )}
                </motion.ul>
            </div>
        </div>
    );
};

export default TransactionHistory;