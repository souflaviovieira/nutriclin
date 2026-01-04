import React from 'react';
import { Flame, Droplets, Circle, Diamond } from 'lucide-react';

type MacroType = 'energia' | 'gordura' | 'carbo' | 'proteina';

interface MacroItemProps {
    label: string;
    value: number | string;
    unit: string;
    type: MacroType;
    className?: string;
}

const MacroIcon: React.FC<{ type: MacroType }> = ({ type }) => {
    const iconProps = { size: 12, strokeWidth: 2.5 };

    switch (type) {
        case 'energia':
            return <Flame {...iconProps} className="text-amber-500" />;
        case 'gordura':
            return <Droplets {...iconProps} className="text-rose-400" />;
        case 'carbo':
            return <Circle {...iconProps} className="text-blue-400" />;
        case 'proteina':
            return <Diamond {...iconProps} className="text-emerald-500" />;
        default:
            return null;
    }
};

const MacroItem: React.FC<MacroItemProps> = ({
    label,
    value,
    unit,
    type,
    className = ''
}) => {
    return (
        <div className={`flex items-center gap-1.5 ${className}`}>
            <MacroIcon type={type} />
            <span className="text-[10px] text-nutri-text-sec">
                <span className="font-bold text-nutri-text">{value}</span>
                <span className="text-nutri-text-dis">{unit}</span>
                <span className="ml-0.5">{label}</span>
            </span>
        </div>
    );
};

export { MacroIcon };
export default MacroItem;
