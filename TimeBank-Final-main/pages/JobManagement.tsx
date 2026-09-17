import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Job, JobStatus } from '../types';
import { useNotification } from '../context/NotificationContext';
import FeedbackModal from '../components/FeedbackModal';
import StarRating from '../components/StarRating';
import { motion } from 'framer-motion';

const JobCard: React.FC<{
    job: Job;
    isProvider: boolean;
    onUpdateStatus: (jobId: string, status: JobStatus) => Promise<void>;
    onConfirm: (jobId: string) => Promise<void>;
    onFeedback: (job: Job) => void;
    delay: number;
}> = ({ job, isProvider, onUpdateStatus, onConfirm, onFeedback, delay }) => {
    const [loading, setLoading] = useState(false);
    
    const handleUpdate = async (status: JobStatus) => {
        setLoading(true);
        await onUpdateStatus(job.id, status);
        setLoading(false);
    };

    const handleConfirm = async () => {
        setLoading(true);
        await onConfirm(job.id);
        setLoading(false);
    }
    
    const getStatusPill = (status: JobStatus) => {
        const styles = {
            [JobStatus.REQUESTED]: 'bg-gray-500/10 text-gray-500 dark:text-gray-400 ring-gray-500/20',
            [JobStatus.ACCEPTED]: 'bg-blue-500/10 text-blue-500 dark:text-blue-400 ring-blue-500/20',
            [JobStatus.IN_PROGRESS]: 'bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 ring-indigo-500/20',
            [JobStatus.FINISHED]: 'bg-purple-500/10 text-purple-500 dark:text-purple-400 ring-purple-500/20',
            [JobStatus.COMPLETED]: 'bg-green-500/10 text-green-500 dark:text-green-400 ring-green-500/20',
            [JobStatus.REJECTED]: 'bg-red-500/10 text-red-500 dark:text-red-400 ring-red-500/20',
        };
        return `px-3 py-1 text-xs font-semibold rounded-full ring-1 ring-inset ${styles[status] || styles[JobStatus.REQUESTED]}`;
    };

    const userHasConfirmed = isProvider ? job.providerConfirmed : job.requesterConfirmed;
    
    const otherUserRating = isProvider ? job.requesterAverageRating : job.providerAverageRating;
    const otherUserRatingCount = isProvider ? job.requesterRatingCount : job.providerRatingCount;

    const btnBase = "px-3 py-1 text-sm rounded-md font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
    const btnPrimary = `${btnBase} bg-serene-accent dark:bg-nocturne-accent text-serene-accent-content dark:text-nocturne-accent-content hover:bg-serene-accent-hover dark:hover:bg-nocturne-accent-hover`;
    const btnSecondary = `${btnBase} bg-serene-bg dark:bg-nocturne-border text-serene-text-main dark:text-nocturne-text-main hover:bg-black/5 dark:hover:bg-white/10`;
    const btnDanger = `${btnBase} bg-error text-white hover:bg-opacity-80`;

    return (
        <motion.div 
            className="bg-serene-panel dark:bg-nocturne-panel p-5 rounded-2xl border border-serene-border dark:border-nocturne-border transition-all hover:border-serene-accent/50 dark:hover:border-nocturne-accent/50 hover:shadow-zenith"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: delay * 0.1 }}
        >
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-serene-text-main dark:text-nocturne-text-main">{job.serviceTitle}</h3>
                    <p className="text-sm text-serene-text-subtle dark:text-nocturne-text-subtle">
                        {isProvider ? `Requester: ${job.requesterName}` : `Provider: ${job.providerName}`}
                    </p>
                    <div className="flex items-center my-1">
                        <StarRating value={otherUserRating} size={16} readOnly={true} />
                        <span className="text-xs text-serene-text-subtle dark:text-nocturne-text-subtle ml-2">({otherUserRatingCount} ratings)</span>
                    </div>
                    <p className="text-sm text-serene-text-subtle dark:text-nocturne-text-subtle">
                        Value: {job.timeValue} hrs
                    </p>
                </div>
                <span className={getStatusPill(job.status)}>
                    {job.status}
                </span>
            </div>
            <div className="mt-4 pt-4 border-t border-serene-border dark:border-nocturne-border flex flex-wrap gap-2 items-center">
                 {isProvider && job.status === JobStatus.REQUESTED && (
                    <>
                        <button onClick={() => handleUpdate(JobStatus.ACCEPTED)} disabled={loading} className={btnPrimary}>Accept</button>
                        <button onClick={() => handleUpdate(JobStatus.REJECTED)} disabled={loading} className={btnDanger}>Reject</button>
                    </>
                 )}
                 {isProvider && job.status === JobStatus.ACCEPTED && (
                     <button onClick={() => handleUpdate(JobStatus.IN_PROGRESS)} disabled={loading} className={btnPrimary}>Start Job</button>
                 )}
                 {isProvider && job.status === JobStatus.IN_PROGRESS && (
                     <button onClick={() => handleUpdate(JobStatus.FINISHED)} disabled={loading} className={btnPrimary}>Mark as Finished</button>
                 )}
                 {(job.status === JobStatus.FINISHED || (job.status === JobStatus.COMPLETED && !userHasConfirmed)) && (
                     <button onClick={handleConfirm} disabled={loading || userHasConfirmed} className={btnPrimary}>
                         {userHasConfirmed ? 'Confirmed' : 'Confirm Completion'}
                     </button>
                 )}
                 {job.status === JobStatus.COMPLETED && (
                    <button onClick={() => onFeedback(job)} className={btnSecondary}>Leave Feedback</button>
                 )}
            </div>
        </motion.div>
    )
};


const JobManagement: React.FC = () => {
    const { user } = useAuth();
    const { jobs, loading, updateJobStatus, confirmJobCompletion, addFeedback } = useData();
    const { addNotification } = useNotification();
    const [view, setView] = useState<'provider' | 'requester'>('requester');
    const [feedbackJob, setFeedbackJob] = useState<Job | null>(null);

    const handleUpdateStatus = async (jobId: string, status: JobStatus) => {
        try {
            await updateJobStatus(jobId, status);
        } catch (error: any) {
            addNotification(error.message, 'error');
        }
    };
    
    const handleConfirm = async (jobId: string) => {
        try {
            await confirmJobCompletion(jobId);
        } catch (error: any) {
            addNotification(error.message, 'error');
        }
    };
    
    const jobsAsProvider = useMemo(() => jobs.filter(j => j.providerId === user?.id).sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime()), [jobs, user]);
    const jobsAsRequester = useMemo(() => jobs.filter(j => j.requesterId === user?.id).sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime()), [jobs, user]);

    const jobsToDisplay = view === 'provider' ? jobsAsProvider : jobsAsRequester;

    if (loading) return <div className="text-center p-8 animate-pulse text-serene-text-subtle dark:text-nocturne-text-subtle">Loading jobs...</div>;
    
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-serene-text-main dark:text-nocturne-text-main">My Jobs</h1>
            
            <div className="border-b border-serene-border dark:border-nocturne-border">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button onClick={() => setView('requester')} className={`${view === 'requester' ? 'border-serene-accent dark:border-nocturne-accent text-serene-accent dark:text-nocturne-accent' : 'border-transparent text-serene-text-subtle dark:text-nocturne-text-subtle hover:text-serene-text-main dark:hover:text-nocturne-text-main hover:border-gray-300 dark:hover:border-gray-700'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition`}>
                        Services I've Requested ({jobsAsRequester.length})
                    </button>
                    <button onClick={() => setView('provider')} className={`${view === 'provider' ? 'border-serene-accent dark:border-nocturne-accent text-serene-accent dark:text-nocturne-accent' : 'border-transparent text-serene-text-subtle dark:text-nocturne-text-subtle hover:text-serene-text-main dark:hover:text-nocturne-text-main hover:border-gray-300 dark:hover:border-gray-700'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition`}>
                        My Service Jobs ({jobsAsProvider.length})
                    </button>
                </nav>
            </div>
            
            <div className="space-y-4">
                {jobsToDisplay.length > 0 ? (
                    jobsToDisplay.map((job, index) => (
                        <JobCard
                            key={job.id}
                            job={job}
                            isProvider={view === 'provider'}
                            onUpdateStatus={handleUpdateStatus}
                            onConfirm={handleConfirm}
                            onFeedback={setFeedbackJob}
                            delay={index}
                        />
                    ))
                ) : (
                    <div className="text-center py-16 px-6 bg-serene-panel dark:bg-nocturne-panel rounded-2xl border border-serene-border dark:border-nocturne-border">
                        <h3 className="text-xl font-semibold text-serene-text-main dark:text-nocturne-text-main">No jobs to display</h3>
                        <p className="text-serene-text-subtle dark:text-nocturne-text-subtle mt-2">
                            {view === 'requester' ? "You haven't requested any services yet." : "You haven't received any service requests yet."}
                        </p>
                    </div>
                )}
            </div>
            
            {feedbackJob && (
                <FeedbackModal
                    job={feedbackJob}
                    onClose={() => setFeedbackJob(null)}
                    onSubmit={addFeedback}
                />
            )}
        </div>
    );
};

export default JobManagement;