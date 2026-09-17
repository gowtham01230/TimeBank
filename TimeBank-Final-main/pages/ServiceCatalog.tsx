import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { ClockIcon, UserCircleIcon } from '../components/icons';
import { Service } from '../types';
import StarRating from '../components/StarRating';
import { motion } from 'framer-motion';

const ServiceCard: React.FC<{ service: Service; onRequest: (service: Service) => void; isOwnService: boolean; isRequesting: boolean; delay: number }> = ({ service, onRequest, isOwnService, isRequesting, delay }) => (
    <motion.div 
        className="group relative h-72 w-full rounded-2xl shadow-zenith border border-serene-border dark:border-nocturne-border transition-all duration-300 hover:shadow-zenith-lg hover:-translate-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: delay * 0.1 }}
    >
        {/* Front of Card Content */}
        <div className="absolute inset-0 bg-serene-panel dark:bg-nocturne-panel p-6 rounded-2xl flex flex-col justify-between transition-opacity duration-300 group-hover:opacity-0">
            <div>
                <div className="flex items-start justify-between">
                    <p className="text-sm font-semibold text-serene-accent dark:text-nocturne-accent">{service.category}</p>
                    <div className="flex items-center justify-center bg-serene-bg dark:bg-nocturne-bg text-serene-accent dark:text-nocturne-accent font-bold px-3 py-1 rounded-full text-sm border border-serene-border dark:border-nocturne-border">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        {service.timeValue} hr{service.timeValue > 1 ? 's' : ''}
                    </div>
                </div>
                <h3 className="text-xl font-bold text-serene-text-main dark:text-nocturne-text-main mt-1">{service.title}</h3>
            </div>
             <div>
                <div className="flex items-center mb-2">
                    <StarRating value={service.providerAverageRating} size={16} readOnly={true} />
                    <span className="text-xs text-serene-text-subtle dark:text-nocturne-text-subtle ml-2">({service.providerRatingCount} ratings)</span>
                </div>
                <div className="flex items-center">
                    <img src={service.providerAvatar} alt={service.providerName} className="h-8 w-8 rounded-full mr-3 ring-2 ring-serene-bg dark:ring-nocturne-bg" />
                    <span className="text-sm font-medium text-serene-text-subtle dark:text-nocturne-text-subtle">{service.providerName}</span>
                </div>
             </div>
        </div>
        {/* Back of Card Content (revealed on hover) */}
        <div className="absolute inset-0 bg-serene-panel dark:bg-nocturne-panel p-6 rounded-2xl flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <div>
                <h3 className="text-lg font-bold text-serene-text-main dark:text-nocturne-text-main">{service.title}</h3>
                <p className="text-serene-text-subtle dark:text-nocturne-text-subtle mt-2 text-sm max-h-32 overflow-auto">{service.description}</p>
             </div>
             <button
                onClick={() => onRequest(service)}
                disabled={isOwnService || isRequesting}
                className="w-full mt-4 px-4 py-2 text-sm font-semibold text-serene-accent-content dark:text-nocturne-accent-content bg-serene-accent dark:bg-nocturne-accent rounded-md hover:bg-serene-accent-hover dark:hover:bg-nocturne-accent-hover disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
                {isOwnService ? 'Your Service' : (isRequesting ? 'Requesting...' : 'Request Service')}
            </button>
        </div>
    </motion.div>
);

const ServiceCatalog: React.FC = () => {
    const { user } = useAuth();
    const { services, loading, requestService } = useData();
    const { addNotification } = useNotification();
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('All');
    const [isRequesting, setIsRequesting] = useState<string | null>(null);

    const handleRequest = async (service: Service) => {
        setIsRequesting(service.id);
        try {
            await requestService(service);
        } catch (error: any) {
            addNotification(error.message, 'error');
        } finally {
            setIsRequesting(null);
        }
    };
    
    const categories = useMemo(() => ['All', ...new Set(services.map(s => s.category))], [services]);

    const filteredServices = useMemo(() => {
        return services.filter(service => 
            (service.title.toLowerCase().includes(searchTerm.toLowerCase()) || service.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (category === 'All' || service.category === category)
        );
    }, [services, searchTerm, category]);

    const inputClass = "w-full p-2 border border-serene-border dark:border-nocturne-border bg-serene-panel dark:bg-nocturne-panel placeholder-serene-text-subtle dark:placeholder-nocturne-text-subtle rounded-md focus:outline-none focus:ring-2 focus:ring-serene-accent dark:focus:ring-nocturne-accent focus:border-transparent transition";

    if (loading) return <div className="text-center p-8 animate-pulse text-serene-text-subtle dark:text-nocturne-text-subtle">Loading services...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-serene-text-main dark:text-nocturne-text-main">Service Catalog</h1>
            <p className="text-serene-text-subtle dark:text-nocturne-text-subtle">Find services offered by community members. Spend your time credits here!</p>

            <div className="flex flex-col md:flex-row gap-4">
                <input
                    type="text"
                    placeholder="Search for services..."
                    className={inputClass + " flex-grow"}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <select
                    className={inputClass}
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>
            
            {filteredServices.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredServices.map((service, index) => (
                        <ServiceCard 
                            key={service.id} 
                            service={service} 
                            onRequest={handleRequest}
                            isOwnService={service.providerId === user?.id}
                            isRequesting={isRequesting === service.id}
                            delay={index}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 px-6 bg-serene-panel dark:bg-nocturne-panel rounded-2xl border border-serene-border dark:border-nocturne-border">
                    <h3 className="text-xl font-semibold text-serene-text-main dark:text-nocturne-text-main">No services found</h3>
                    <p className="text-serene-text-subtle dark:text-nocturne-text-subtle mt-2">Try adjusting your search or filter. Or, be the first to offer a service in this category!</p>
                </div>
            )}
        </div>
    );
};

export default ServiceCatalog;