import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    noPadding?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', noPadding = false }) => {
    return (
        <div
            className={`
        bg-white rounded-2xl border border-slate-100 shadow-[0px_4px_20px_rgba(0,0,0,0.05)]
        ${!noPadding ? 'p-6 md:p-8' : ''}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
        >
            {children}
        </div>
    );
};

export default Card;
