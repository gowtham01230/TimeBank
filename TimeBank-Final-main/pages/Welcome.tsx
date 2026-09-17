import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClockIcon, GroupIcon, ExchangeIcon } from '../components/icons';
import { useTheme } from '../context/ThemeContext';

// Declare Vanta types for TypeScript
declare global {
    interface Window {
        VANTA: any;
    }
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; delay: number }> = ({ icon, title, children, delay }) => (
    <motion.div 
        className="bg-serene-panel/50 dark:bg-nocturne-panel/50 backdrop-blur-lg p-8 rounded-2xl border border-serene-border dark:border-nocturne-border transition-all duration-300 hover:shadow-zenith-lg hover:-translate-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
    >
        <div className="flex justify-center items-center mb-4 h-16 w-16 rounded-full bg-serene-bg dark:bg-nocturne-bg mx-auto border border-serene-border dark:border-nocturne-border">{icon}</div>
        <h3 className="text-xl font-semibold text-serene-text-main dark:text-nocturne-text-main mb-2">{title}</h3>
        <p className="text-serene-text-subtle dark:text-nocturne-text-subtle">{children}</p>
    </motion.div>
);

const Welcome: React.FC = () => {
    const { theme } = useTheme();
    const vantaRef = useRef<HTMLDivElement>(null);
    const [vantaEffect, setVantaEffect] = useState<any>(null);

    useEffect(() => {
        if (!vantaEffect && window.VANTA && window.VANTA.GLOBE) {
            setVantaEffect(window.VANTA.GLOBE({
                el: vantaRef.current,
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 1.00,
            }));
        }
        
        if (vantaEffect) {
            vantaEffect.setOptions({
                color: theme === 'dark' ? 0xe0b841 : 0x1a472a, // Gold : Green
                backgroundColor: theme === 'dark' ? 0x121826 : 0xf8f7f4,
                size: 1.2
            });
        }

        return () => {
            if (vantaEffect) vantaEffect.destroy();
        };
    }, [vantaEffect, theme]);

    return (
        <div className="relative overflow-hidden">
            <div ref={vantaRef} className="absolute inset-0 z-0" />
            <div className="relative text-center py-20 px-4 sm:px-6 lg:px-8">
                <motion.h1 
                    className="text-5xl md:text-7xl font-extrabold text-serene-text-main dark:text-nocturne-text-main"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Exchange Time, <br/>
                    <span className="text-serene-accent dark:text-nocturne-accent">Build Community.</span>
                </motion.h1>
                <motion.p 
                    className="mt-4 max-w-2xl mx-auto text-xl text-serene-text-subtle dark:text-nocturne-text-subtle"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    Join a network where your time and skills are the currency. Help others, earn credits, and get the help you need.
                </motion.p>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <Link to="/auth" className="inline-block mt-10 bg-serene-accent dark:bg-nocturne-accent text-serene-accent-content dark:text-nocturne-accent-content font-bold py-3 px-8 rounded-lg shadow-zenith hover:bg-serene-accent-hover dark:hover:bg-nocturne-accent-hover transition-transform transform hover:scale-105">
                        Join the Community
                    </Link>
                </motion.div>
            </div>

            <div className="mt-10 pb-20 max-w-7xl mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<GroupIcon className="h-8 w-8 text-serene-accent dark:text-nocturne-accent" />}
                        title="Share Your Skills"
                        delay={0.6}
                    >
                        Offer services you're good at—from gardening and tutoring to graphic design and pet sitting. Everyone has something to offer.
                    </FeatureCard>
                    <FeatureCard
                        icon={<ClockIcon className="h-8 w-8 text-serene-accent dark:text-nocturne-accent" />}
                        title="Earn Time Credits"
                        delay={0.8}
                    >
                        For every hour of service you provide, you earn one time credit. Time is the only currency here, making every contribution equal.
                    </FeatureCard>
                    <FeatureCard
                        icon={<ExchangeIcon className="h-8 w-8 text-serene-accent dark:text-nocturne-accent" />}
                        title="Receive Services"
                        delay={1.0}
                    >
                        Spend your earned time credits to get help from other members in the community. It's a cycle of giving and receiving.
                    </FeatureCard>
                </div>
            </div>
        </div>
    );
};

export default Welcome;