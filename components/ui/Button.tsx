import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    children: React.ReactNode;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
}

const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-nutri-blue text-white shadow-nutri-soft hover:bg-nutri-blue-hover hover:scale-[1.02] active:scale-95',
    secondary: 'bg-nutri-secondary text-nutri-text hover:bg-nutri-border/30 hover:scale-[1.02] active:scale-95 shadow-sm',
    ghost: 'bg-transparent text-nutri-text-sec hover:bg-nutri-main/50 hover:text-nutri-text',
    danger: 'bg-nutri-error text-white hover:bg-red-600 hover:scale-[1.02] active:scale-95',
};

const sizeClasses: Record<ButtonSize, string> = {
    sm: 'px-4 py-2 text-[10px]',
    md: 'px-6 py-3 text-[11px]',
    lg: 'px-8 py-4 text-xs',
};

const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    children,
    icon,
    iconPosition = 'left',
    className = '',
    disabled,
    ...props
}) => {
    const baseClasses = 'flex items-center justify-center gap-2 rounded-xl font-black uppercase tracking-widest transition-all';

    return (
        <button
            className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
            disabled={disabled}
            {...props}
        >
            {icon && iconPosition === 'left' && icon}
            {children}
            {icon && iconPosition === 'right' && icon}
        </button>
    );
};

export default Button;
