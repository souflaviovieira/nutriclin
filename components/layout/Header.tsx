import React from 'react';
import { Menu, Bell, ChevronRight } from 'lucide-react';
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
        <header className="flex-shrink-0 bg-nutri-secondary px-4 md:px-10 py-4 md:py-6 flex items-center justify-between gap-3">
            {/* Left: Menu + Title */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* Mobile Menu Button */}
                <button
                    onClick={onToggleSidebar}
                    className="lg:hidden p-2.5 text-nutri-text-sec hover:bg-white rounded-xl transition-colors active:scale-95"
                    aria-label="Menu"
                >
                    <Menu size={22} />
                </button>
                
                {/* Title Block */}
                <div className="min-w-0 flex-1">
                    <h2 className="text-lg md:text-2xl font-bold text-nutri-text tracking-tight leading-tight truncate">
                        {title}
                    </h2>
                    {description && (
                        <p className="text-nutri-text-sec font-medium text-xs md:text-sm truncate hidden sm:block">
                            {description}
                        </p>
                    )}
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                {/* Notifications */}
                <button 
                    className="p-2.5 md:p-3 text-nutri-text-sec hover:bg-white rounded-xl relative transition-all active:scale-95"
                    aria-label="Notificações"
                >
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 md:top-3 md:right-3 w-2 h-2 bg-nutri-error rounded-full border-2 border-nutri-secondary" />
                </button>

                {/* Profile */}
                <button
                    onClick={onProfileClick}
                    className="flex items-center gap-2 md:gap-3 p-1 md:pl-4 md:border-l border-nutri-text-dis/20 group"
                    aria-label="Perfil"
                >
                    {/* Desktop: Name + Sign out */}
                    <div className="text-right hidden md:block">
                        <p className="text-xs font-black text-nutri-text tracking-tight group-hover:text-nutri-blue transition-colors">
                            {profile?.display_name || 'Usuário'}
                        </p>
                        <span className="text-[10px] text-nutri-text-dis font-bold">
                            Ver Perfil
                        </span>
                    </div>
                    
                    {/* Avatar */}
                    <div className="w-10 h-10 md:w-10 md:h-10 rounded-xl bg-nutri-blue flex items-center justify-center text-white text-xs font-black overflow-hidden group-hover:ring-2 ring-nutri-blue/30 transition-all">
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
