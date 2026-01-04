import React from 'react';
import { ChevronDown } from 'lucide-react';

interface FilterSelectProps {
    label: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
    className?: string;
}

const FilterSelect: React.FC<FilterSelectProps> = ({
    label,
    value,
    options,
    onChange,
    className = ''
}) => {
    return (
        <div className={`relative ${className}`}>
            <label className="block text-[9px] font-black text-nutri-text-dis uppercase tracking-widest mb-1.5">
                {label}
            </label>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full appearance-none bg-nutri-secondary border border-nutri-border/50 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-nutri-text focus:outline-none focus:ring-2 focus:ring-nutri-blue/20 focus:border-nutri-blue transition-all cursor-pointer"
                >
                    {options.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <ChevronDown
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-nutri-text-dis pointer-events-none"
                />
            </div>
        </div>
    );
};

export default FilterSelect;
