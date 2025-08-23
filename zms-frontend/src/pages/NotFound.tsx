
import React from 'react';

const NotFound = () => {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[var(--background)] p-6">
            <div className="flex flex-col md:flex-row items-center gap-8 bg-[var(--card)] rounded-2xl shadow-lg p-8 border-2 border-[var(--border)] animate-slide-down">
                <img
                    src="/custom404.webp"
                    alt="Lost animal in the zoo"
                    className="w-60 h-60 object-contain drop-shadow-lg mb-4 md:mb-0"
                    style={{ background: 'var(--accent-color)', borderRadius: '1.5rem', border: '4px solid var(--primary-color)' }}
                />
                <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-md">
                    <h1 className="text-5xl font-extrabold mb-2 text-[var(--primary-color)]">404</h1>
                    <h2 className="text-2xl font-bold mb-4 text-black">Page Not Found</h2>
                    <p className="mb-6 text-[var(--secondary-foreground)]">
                        Oops! Looks like you wandered off the zoo path.<br />
                        The page you’re looking for doesn’t exist.<br />
                        Maybe you’ll find a rare animal instead!
                    </p>
                    <a
                        href="/"
                        className="inline-block px-6 py-3 rounded-lg font-semibold bg-[var(--accent-color)] text-[var(--accent-foreground)] shadow-md hover:bg-[var(--primary-color)] hover:text-[var(--primary-foreground)] transition-colors duration-200"
                    >
                        Return to Home
                    </a>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
