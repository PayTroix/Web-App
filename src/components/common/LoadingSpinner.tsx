import React from 'react';

interface LoadingSpinnerProps {
    className?: string;
    fullHeight?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className = '', fullHeight = false }) => {
    const containerClasses = `flex justify-center items-center ${fullHeight ? 'min-h-screen' : 'h-64'} ${className}`;

    return (
        <div className={containerClasses}>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );
};

export default LoadingSpinner;
