import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';

interface HeaderProps {
    session: any;
    title?: string;
    description?: string;
    onToggleSidebar: () => void;
    onProfileClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ session, title, description, onToggleSidebar, onProfileClick }) => {
    const { profile } = useUser();

    return (
        <header className="flex-shrink-0 bg-gradient-to-b from-cream-100 to-cream-100/0 px-4 md:px-10 py-4 md:py-6 flex items-center justify-between gap-3">
            {/* Left: Menu + Title */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* Mobile Menu Button */}
                <button
                    onClick={onToggleSidebar}
                    className="lg:hidden p-2.5 text-slate-warm-500 hover:bg-cream-200 rounded-xl transition-all active:scale-95"
                    aria-label="Menu"
                >
                    <Menu size={22} />
                </button>
                
                {/* Title Block */}
                <div className="min-w-0 flex-1">
                    <h2 className="text-xl md:text-2xl font-display font-bold text-slate-warm-800 tracking-tight leading-tight truncate">
                        {title}
                    </h2>
                    {description && (
                        <p className="text-slate-warm-500 font-medium text-xs md:text-sm truncate hidden sm:block">
                            {description}
                        </p>
                    )}
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                {/* Notifications */}
                <button 
                    className="p-2.5 md:p-3 text-slate-warm-500 hover:bg-cream-200 rounded-xl relative transition-all active:scale-95"
                    aria-label="Notificações"
                >
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 md:top-2 md:right-2 w-2.5 h-2.5 bg-coral-400 rounded-full border-2 border-cream-100 animate-pulse" />
                </button>

                {/* Profile */}
                <button
                    onClick={onProfileClick}
                    className="flex items-center gap-2 md:gap-3 p-1 md:pl-4 md:border-l border-cream-300 group"
                    aria-label="Perfil"
                >
                    {/* Desktop: Name + Sign out */}
                    <div className="text-right hidden md:block">
                        <p className="text-xs font-bold text-slate-warm-800 tracking-tight group-hover:text-coral-500 transition-colors">
                            {profile?.display_name || 'Usuário'}
                        </p>
                        <span className="text-[10px] text-slate-warm-400 font-medium">
                            Ver Perfil
                        </span>
                    </div>
                    
                    {/* Avatar */}
                    <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-gradient-to-br from-coral-400 to-coral-500 flex items-center justify-center text-white text-sm font-bold overflow-hidden group-hover:ring-4 ring-coral-100 transition-all shadow-soft-sm">
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span>{profile?.display_name?.charAt(0).toUpperCase() || 'U'}</span>
                        )}
                    </div>
                </button>
            </div>
        </header>
    );
};

export default Header;
