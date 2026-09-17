import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';
import { Service, Job, Transaction, Feedback, JobStatus, User, PersistentNotification } from '../types';

// The backend server URL
const API_URL = 'http://localhost:5000/api';

interface DataContextType {
  services: Service[];
  topServices: Service[];
  jobs: Job[];
  transactions: Transaction[];
  feedback: Feedback[];
  persistentNotifications: PersistentNotification[];
  loading: boolean;
  fetchAllData: () => void;
  addService: (serviceData: Omit<Service, 'id' | 'providerId' | 'providerName' | 'providerAvatar' | 'providerAverageRating' | 'providerRatingCount' | 'createdAt'>) => Promise<void>;
  requestService: (service: Service) => Promise<void>;
  updateJobStatus: (jobId: string, status: JobStatus) => Promise<void>;
  confirmJobCompletion: (jobId: string) => Promise<void>;
  addFeedback: (feedbackData: Omit<Feedback, 'id' | 'createdAt' | 'fromUserId' | 'fromUserName' | 'toUserId' | 'toUserName' >) => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Helper function to get the auth token
const getAuthToken = () => {
    return sessionStorage.getItem('timebank_token');
}


export const DataProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const [services, setServices] = useState<Service[]>([]);
    const [topServices, setTopServices] = useState<Service[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [persistentNotifications, setPersistentNotifications] = useState<PersistentNotification[]>([]);
    const [feedback, setFeedback] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);

    const { user, isAuthenticated } = useAuth();
    const { addNotification } = useNotification();

    const fetchAllData = useCallback(async () => {
        if (!isAuthenticated || !user) {
             setLoading(false);
             setServices([]);
             setTopServices([]);
             setJobs([]);
             setTransactions([]);
             setPersistentNotifications([]);
             return;
        };

        setLoading(true);
        try {
            const token = getAuthToken();
            if (!token) {
                setLoading(false);
                return;
            }
            const headers = { 'Content-Type': 'application/json', 'x-auth-token': token };

            const [servicesRes, topServicesRes, jobsRes, transactionsRes, notificationsRes] = await Promise.all([
                fetch(`${API_URL}/services`, { headers }),
                fetch(`${API_URL}/services/top`, { headers }),
                fetch(`${API_URL}/jobs`, { headers }),
                fetch(`${API_URL}/transactions`, { headers }),
                fetch(`${API_URL}/notifications`, { headers }),
            ]);

            if (!servicesRes.ok || !topServicesRes.ok || !jobsRes.ok || !transactionsRes.ok || !notificationsRes.ok) {
                throw new Error('Failed to fetch data');
            }

            const servicesData = await servicesRes.json();
            const topServicesData = await topServicesRes.json();
            const jobsData = await jobsRes.json();
            const transactionsData = await transactionsRes.json();
            const notificationsData = await notificationsRes.json();
            
            const mapService = (s: any) => ({
                ...s,
                id: s._id,
                providerId: s.provider._id,
                providerName: s.provider.name,
                providerAvatar: s.provider.profilePhoto,
                providerAverageRating: s.provider.averageRating || 0,
                providerRatingCount: s.provider.ratingCount || 0,
            });

            const mappedServices = servicesData.map(mapService);
            const mappedTopServices = topServicesData.map(mapService);

            const mappedJobs = jobsData.map((j: any) => ({
                ...j,
                id: j._id,
                serviceId: j.service._id,
                serviceTitle: j.service.title,
                timeValue: j.service.timeValue,
                requesterId: j.requester._id,
                providerId: j.provider._id,
                requesterName: j.requester.name,
                providerName: j.provider.name,
                requesterAverageRating: j.requester.averageRating || 0,
                requesterRatingCount: j.requester.ratingCount || 0,
                providerAverageRating: j.provider.averageRating || 0,
                providerRatingCount: j.provider.ratingCount || 0,
                createdAt: new Date(j.createdAt),
            }));
            
            const mappedTransactions = transactionsData.map((t: any) => ({
                id: t._id,
                jobId: t.job._id,
                jobTitle: t.job.service.title,
                fromUserId: t.fromUser._id,
                fromUserName: t.fromUser.name,
                toUserId: t.toUser._id,
                toUserName: t.toUser.name,
                amount: t.amount,
                description: t.description,
                timestamp: new Date(t.timestamp),
            }));


            setServices(mappedServices);
            setTopServices(mappedTopServices);
            setJobs(mappedJobs);
            setTransactions(mappedTransactions);
            setPersistentNotifications(notificationsData);

        } catch (error: any) {
            console.error("Error fetching data:", error);
            addNotification(error.message || 'Could not connect to the server.', 'error');
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, user, addNotification]);
    
    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    const addService = async (serviceData: Omit<Service, 'id' | 'providerId' | 'providerName' | 'providerAvatar' | 'providerAverageRating' | 'providerRatingCount' | 'createdAt'>) => {
        const token = getAuthToken();
        if (!token) throw new Error("You must be logged in to post a service.");

        const response = await fetch(`${API_URL}/services`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
            body: JSON.stringify(serviceData)
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || 'Failed to post service.');
        }
        addNotification('Service posted successfully!', 'success');
        await fetchAllData();
    };

    const requestService = async (service: Service) => {
        const token = getAuthToken();
        if (!token) throw new Error("You must be logged in to request a service.");

        const response = await fetch(`${API_URL}/jobs/request/${service.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || 'Failed to request service.');
        }
        addNotification('Service requested! Check "My Jobs" for updates.', 'success');
        await fetchAllData();
    };

    const updateJobStatus = async (jobId: string, status: JobStatus) => {
        const token = getAuthToken();
        if (!token) throw new Error("Authentication error.");

        const response = await fetch(`${API_URL}/jobs/${jobId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
            body: JSON.stringify({ status })
        });
        
        if (!response.ok) throw new Error('Failed to update job status.');

        addNotification(`Job status updated to "${status}"`, 'info');
        await fetchAllData();
    };
    
    const confirmJobCompletion = async (jobId: string) => {
        const token = getAuthToken();
        if (!token) throw new Error("Authentication error.");
        
        const response = await fetch(`${API_URL}/jobs/${jobId}/confirm`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        });

        if (!response.ok) throw new Error('Failed to confirm completion.');
        
        const updatedJob = await response.json();

        if (updatedJob.status === JobStatus.COMPLETED) {
            addNotification('Job completed by both parties! Time credits transferred.', 'success');
        } else {
            addNotification('Completion confirmed. Waiting for the other party.', 'info');
        }
        await fetchAllData();
    };

    const addFeedback = async (feedbackData: Omit<Feedback, 'id' | 'createdAt' | 'fromUserId' | 'fromUserName' | 'toUserId' | 'toUserName' >) => {
        const token = getAuthToken();
        if (!token) throw new Error("Authentication error.");
        
        const { jobId, rating, comment } = feedbackData;

        const response = await fetch(`${API_URL}/jobs/${jobId}/feedback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
            body: JSON.stringify({ rating, comment })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || 'Failed to submit feedback.');
        }
        
        addNotification('Thank you for your feedback!', 'success');
        await fetchAllData();
    };

    const markNotificationAsRead = async (notificationId: string) => {
        setPersistentNotifications(prev => prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n));
        const token = getAuthToken();
        try {
            await fetch(`${API_URL}/notifications/${notificationId}/read`, {
                method: 'PUT',
                headers: { 'x-auth-token': token || '' },
            });
        } catch (error) {
            console.error("Failed to mark notification as read", error);
            // Optionally revert state change
            setPersistentNotifications(prev => prev.map(n => n._id === notificationId ? { ...n, isRead: false } : n));
        }
    };

    const value = { services, topServices, jobs, transactions, feedback, persistentNotifications, loading, fetchAllData, addService, requestService, updateJobStatus, confirmJobCompletion, addFeedback, markNotificationAsRead };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};