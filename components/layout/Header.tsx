import React from 'react';
import { Menu, Search, Bell, User } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
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
        <header className="flex-shrink-0 bg-nutri-secondary px-6 md:px-10 py-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button
                    onClick={onToggleSidebar}
                    className="lg:hidden p-2.5 text-nutri-text-sec hover:bg-nutri-main/50 rounded-2xl transition-colors"
                >
                    <Menu size={22} />
                </button>
                <div className="flex flex-col">
                    <h2 className="text-xl md:text-2xl font-bold text-nutri-text tracking-tighter leading-tight">{title}</h2>
                    {description && <p className="text-nutri-text-sec font-medium text-xs md:text-sm">{description}</p>}
                </div>
            </div>
            <div className="flex items-center gap-2 md:gap-5">
                <button className="p-3 text-nutri-text-sec hover:bg-nutri-main/50 rounded-2xl relative transition-all">
                    <Bell size={20} />
                    <span className="absolute top-3 right-3 w-2 h-2 bg-nutri-error rounded-full border-2 border-nutri-secondary"></span>
                </button>
                <div
                    onClick={onProfileClick}
                    className="flex items-center gap-3.5 pl-2 md:pl-5 border-l border-nutri-text-dis/20 cursor-pointer group"
                >
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-black text-nutri-text tracking-tight group-hover:text-nutri-blue transition-colors">{profile?.display_name || 'Usuário'}</p>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                supabase.auth.signOut();
                            }}
                            className="text-[10px] text-nutri-error font-black uppercase tracking-widest hover:opacity-70 transition-opacity"
                        >
                            Sair
                        </button>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-nutri-blue flex items-center justify-center text-white text-xs font-black rotate-3 overflow-hidden group-hover:rotate-0 transition-all border-2 border-transparent group-hover:border-white">
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span>{profile?.display_name?.charAt(0).toUpperCase() || 'U'}</span>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
