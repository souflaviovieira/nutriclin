import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
    label,
    error,
    icon,
    className = '',
    id,
    ...props
}) => {
    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={id}
                    className="block text-[10px] font-black text-nutri-text-sec uppercase tracking-widest mb-2 ml-1"
                >
                    {label}
                </label>
            )}
            <div className="relative group">
                {icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-nutri-text-dis group-focus-within:text-nutri-blue transition-colors">
                        {icon}
                    </div>
                )}
                <input
                    id={id}
                    className={`
            w-full bg-nutri-secondary/50 border border-nutri-border rounded-xl 
            ${icon ? 'pl-11' : 'pl-4'} pr-4 py-3.5
            text-sm font-semibold text-nutri-text placeholder:text-nutri-text-dis/70
            outline-none focus:ring-4 focus:ring-nutri-blue/10 focus:border-nutri-blue
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-nutri-error focus:border-nutri-error focus:ring-nutri-error/10' : ''}
            ${className}
          `.trim().replace(/\s+/g, ' ')}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-1.5 ml-1 text-[10px] font-bold text-nutri-error flex items-center gap-1">
                    {error}
                </p>
            )}
        </div>
    );
};

export default Input;
