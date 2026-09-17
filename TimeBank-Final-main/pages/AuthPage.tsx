import React, { useState } from 'react';
import SignIn from './SignIn';
import SignUp from './SignUp';

const AuthPage: React.FC = () => {
    const [isLoginView, setIsLoginView] = useState(true);

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-serene-panel/80 dark:bg-nocturne-panel/80 backdrop-blur-lg p-10 rounded-2xl shadow-zenith-lg border border-serene-border dark:border-nocturne-border">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-serene-text-main dark:text-nocturne-text-main">
                        {isLoginView ? 'Welcome Back' : 'Join the Community'}
                    </h2>
                </div>
                 <div className="flex justify-center border-b border-serene-border dark:border-nocturne-border">
                    <button onClick={() => setIsLoginView(true)} className={`px-6 py-2 text-sm font-medium transition ${isLoginView ? 'border-b-2 border-serene-accent dark:border-nocturne-accent text-serene-accent dark:text-nocturne-accent' : 'text-serene-text-subtle dark:text-nocturne-text-subtle hover:text-serene-text-main dark:hover:text-nocturne-text-main'}`}>
                        Sign In
                    </button>
                    <button onClick={() => setIsLoginView(false)} className={`px-6 py-2 text-sm font-medium transition ${!isLoginView ? 'border-b-2 border-serene-accent dark:border-nocturne-accent text-serene-accent dark:text-nocturne-accent' : 'text-serene-text-subtle dark:text-nocturne-text-subtle hover:text-serene-text-main dark:hover:text-nocturne-text-main'}`}>
                        Sign Up
                    </button>
                </div>
                
                {isLoginView ? <SignIn /> : <SignUp />}
            </div>
        </div>
    );
};

export default AuthPage;