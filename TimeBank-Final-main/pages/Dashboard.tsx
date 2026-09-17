import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { JobStatus, Service } from '../types';
import { ClockIcon, BriefcaseIcon, GiftIcon, ChevronLeftIcon, ChevronRightIcon } from '../components/icons';
import StarRating from '../components/StarRating';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const StatCard: React.FC<{ icon: React.ReactNode, title: string, value: string | number }> = ({ icon, title, value }) => {
    return (
        <motion.div 
          variants={itemVariants}
          className="relative bg-serene-panel dark:bg-nocturne-panel p-6 rounded-2xl border border-serene-border dark:border-nocturne-border shadow-zenith"
        >
          <div className="relative flex items-center">
             <div className="p-3 rounded-xl bg-serene-bg dark:bg-nocturne-bg mr-4 border border-serene-border dark:border-nocturne-border">
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-serene-text-subtle dark:text-nocturne-text-subtle">{title}</p>
                <p className="text-2xl font-bold text-serene-text-main dark:text-nocturne-text-main">{value}</p>
            </div>
          </div>
        </motion.div>
    );
};

const ServiceCarouselCard: React.FC<{ service: Service }> = ({ service }) => {
    return (
        <motion.div 
            className="flex-shrink-0 w-64 md:w-72 h-96 snap-start mr-6 last:mr-0 rounded-2xl overflow-hidden relative group transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-zenith"
            variants={itemVariants}
        >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 z-10"></div>
            <img src='../components/assets/image.png' alt={service.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute bottom-0 left-0 p-4 z-20 text-white w-full">
                <h3 className="font-bold text-lg truncate text-nocturne-text-main">{service.title}</h3>
                <p className="text-sm text-nocturne-text-subtle">by {service.providerName}</p>
                <div className="flex items-center mt-1">
                    <StarRating value={service.providerAverageRating} size={16} readOnly />
                    <span className="text-xs ml-2 text-nocturne-text-subtle">({service.providerRatingCount})</span>
                </div>
            </div>
             <Link to="/services" className="absolute inset-0 z-30" aria-label={`View details for ${service.title}`}></Link>
        </motion.div>
    );
};


const TopServicesCarousel: React.FC = () => {
    const { topServices } = useData();
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);

    if (!topServices || topServices.length === 0) {
        return null;
    }
    
    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };
    
    return (
        <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold text-serene-text-main dark:text-nocturne-text-main mb-4">Top Rated Services</h2>
            <div className="relative group">
                <motion.div 
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 scrollbar-hide -mx-4 px-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {topServices.map(service => (
                       <ServiceCarouselCard key={service.id} service={service} />
                    ))}
                </motion.div>
                <button 
                    onClick={() => scroll('left')}
                    className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-4 bg-serene-panel/50 dark:bg-nocturne-panel/50 backdrop-blur-sm p-2 rounded-full text-serene-text-main dark:text-nocturne-text-main opacity-0 group-hover:opacity-100 transition-opacity z-30 hover:bg-serene-panel dark:hover:bg-nocturne-panel border border-serene-border dark:border-nocturne-border"
                    aria-label="Scroll left"
                >
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                 <button 
                    onClick={() => scroll('right')}
                    className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-4 bg-serene-panel/50 dark:bg-nocturne-panel/50 backdrop-blur-sm p-2 rounded-full text-serene-text-main dark:text-nocturne-text-main opacity-0 group-hover:opacity-100 transition-opacity z-30 hover:bg-serene-panel dark:hover:bg-nocturne-panel border border-serene-border dark:border-nocturne-border"
                    aria-label="Scroll right"
                >
                    <ChevronRightIcon className="w-6 h-6" />
                </button>
            </div>
        </motion.div>
    );
};


const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const { jobs, loading } = useData();

    if (loading || !user) {
        return <div className="text-center p-8 animate-pulse text-serene-text-subtle dark:text-nocturne-text-subtle">Loading dashboard...</div>
    }

    const myOpenJobs = jobs.filter(job => 
        (job.providerId === user.id && (job.status === JobStatus.REQUESTED || job.status === JobStatus.ACCEPTED || job.status === JobStatus.IN_PROGRESS)) ||
        (job.requesterId === user.id && (job.status === JobStatus.ACCEPTED || job.status === JobStatus.IN_PROGRESS))
    ).length;

    const servicesProvided = jobs.filter(job => job.providerId === user.id && job.status === JobStatus.COMPLETED).length;
    const servicesReceived = jobs.filter(job => job.requesterId === user.id && job.status === JobStatus.COMPLETED).length;
    const completedExchanges = servicesProvided + servicesReceived;

    const recentJobs = jobs.slice(0, 5);

    const getStatusColor = (status: JobStatus) => {
        switch (status) {
            case JobStatus.COMPLETED: return 'text-success';
            case JobStatus.REJECTED: return 'text-error';
            case JobStatus.IN_PROGRESS: return 'text-blue-500';
            case JobStatus.ACCEPTED: return 'text-indigo-500';
            default: return 'text-serene-text-subtle dark:text-nocturne-text-subtle';
        }
    };

    return (
        <motion.div 
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.h1 variants={itemVariants} className="text-3xl font-bold text-serene-text-main dark:text-nocturne-text-main">Welcome back, {user?.name}!</motion.h1>

            <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard icon={<ClockIcon className="h-8 w-8 text-serene-accent dark:text-nocturne-accent" />} title="Time Balance" value={`${user.timeBalance.toFixed(2)} hrs`} />
                <StatCard icon={<BriefcaseIcon className="h-8 w-8 text-serene-accent dark:text-nocturne-accent" />} title="Open Jobs" value={myOpenJobs} />
                <StatCard icon={<GiftIcon className="h-8 w-8 text-serene-accent dark:text-nocturne-accent" />} title="Completed Exchanges" value={completedExchanges} />
            </motion.div>
            
            <TopServicesCarousel />

            <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div variants={itemVariants} className="bg-serene-panel dark:bg-nocturne-panel p-6 rounded-2xl border border-serene-border dark:border-nocturne-border shadow-zenith">
                    <h2 className="text-xl font-semibold mb-4 text-serene-text-main dark:text-nocturne-text-main">Recent Activity</h2>
                    {recentJobs.length > 0 ? (
                        <ul className="space-y-4">
                            {recentJobs.map(job => (
                                <li key={job.id} className="flex items-center justify-between p-3 bg-serene-bg dark:bg-nocturne-bg rounded-lg border border-serene-border dark:border-nocturne-border">
                                    <div>
                                        <p className="font-semibold text-serene-text-main dark:text-nocturne-text-main">{job.serviceTitle}</p>
                                        <p className="text-sm text-serene-text-subtle dark:text-nocturne-text-subtle">
                                            {job.providerId === user.id ? `With ${job.requesterName}` : `With ${job.providerName}`}
                                        </p>
                                    </div>
                                    <span className={`font-bold text-sm ${getStatusColor(job.status)}`}>{job.status}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-serene-text-subtle dark:text-nocturne-text-subtle">No recent jobs to display.</p>
                    )}
                     <Link to="/jobs" className="text-serene-accent dark:text-nocturne-accent hover:underline font-medium mt-4 inline-block">View all jobs &rarr;</Link>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-serene-panel dark:bg-nocturne-panel p-6 rounded-2xl border border-serene-border dark:border-nocturne-border shadow-zenith">
                    <h2 className="text-xl font-semibold mb-4 text-serene-text-main dark:text-nocturne-text-main">Quick Actions</h2>
                     <div className="flex flex-col space-y-4">
                         <Link to="/services" className="block w-full text-center p-3 rounded-lg font-medium bg-serene-accent dark:bg-nocturne-accent text-serene-accent-content dark:text-nocturne-accent-content hover:bg-serene-accent-hover dark:hover:bg-nocturne-accent-hover transition-colors">Browse Services</Link>
                         <Link to="/post-service" className="block w-full text-center p-3 rounded-lg font-medium bg-serene-bg dark:bg-nocturne-panel hover:bg-black/5 dark:hover:bg-white/5 text-serene-text-main dark:text-nocturne-text-main border border-serene-border dark:border-nocturne-border transition-colors">Offer a New Service</Link>
                         <Link to="/profile" className="block w-full text-center p-3 rounded-lg font-medium bg-transparent hover:bg-serene-bg dark:hover:bg-nocturne-panel border border-serene-border dark:border-nocturne-border transition-colors">Update Your Profile</Link>
                     </div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default Dashboard;