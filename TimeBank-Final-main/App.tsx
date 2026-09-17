import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';
import { AnimatePresence, motion, Transition } from 'framer-motion';

import Header from './components/Header';

import Welcome from './pages/Welcome';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import ServiceCatalog from './pages/ServiceCatalog';
import PostService from './pages/PostService';
import JobManagement from './pages/JobManagement';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import NotificationToast from './components/NotificationToast';
import TransactionHistory from './pages/TransactionHistory';

const PrivateRoute: React.FC<{ children: JSX.Element; adminOnly?: boolean }> = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="text-xl animate-pulse">Loading...</div></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/welcome" replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
      return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AnimatedRoutes = () => {
    const location = useLocation();
    const { isAuthenticated } = useAuth();

    const pageVariants = {
      initial: { opacity: 0, x: -20 },
      in: { opacity: 1, x: 0 },
      out: { opacity: 0, x: 20 }
    };

    // FIX: Explicitly type `pageTransition` with the `Transition` type from framer-motion.
    // This ensures TypeScript infers the correct literal types for properties like `type` and `ease`,
    // which is required by framer-motion's `transition` prop, fixing the type error.
    const pageTransition: Transition = {
      type: "tween",
      ease: "easeInOut",
      duration: 0.4
    };

    return (
        <AnimatePresence mode="wait">
            <motion.main
                key={location.pathname}
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="container mx-auto p-4 md:p-6 lg:p-8"
            >
                <Routes location={location}>
                    <Route path="/welcome" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Welcome />} />
                    <Route path="/auth" element={isAuthenticated ? <Navigate to="/dashboard" /> : <AuthPage />} />

                    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="/services" element={<PrivateRoute><ServiceCatalog /></PrivateRoute>} />
                    <Route path="/post-service" element={<PrivateRoute><PostService /></PrivateRoute>} />
                    <Route path="/jobs" element={<PrivateRoute><JobManagement /></PrivateRoute>} />
                    <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                    <Route path="/transactions" element={<PrivateRoute><TransactionHistory /></PrivateRoute>} />
                    <Route path="/admin" element={<PrivateRoute adminOnly={true}><AdminDashboard /></PrivateRoute>} />

                    <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/welcome"} />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </motion.main>
        </AnimatePresence>
    )
}


function App() {
  return (
    <ThemeProvider>
        <NotificationProvider>
          <AuthProvider>
            <DataProvider>
                <Router>
                    <div className="min-h-screen font-sans">
                        <Header />
                        <AnimatedRoutes />
                        <NotificationToast />
                    </div>
                </Router>
            </DataProvider>
          </AuthProvider>
        </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;