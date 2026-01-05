import React from 'react';
import { Menu, Search, Bell, User } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import { useUser } from '../../contexts/UserContext';

interface HeaderProps {
    session: any;
    onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ session, onToggleSidebar }) => {
    const { profile } = useUser();

    return (
        <header className="flex-shrink-0 bg-nutri-secondary px-6 md:px-10 py-6 flex items-center justify-between">
            <div className="flex items-center gap-6">
                <button
                    onClick={onToggleSidebar}
                    className="lg:hidden p-2.5 text-nutri-text-sec hover:bg-nutri-main/50 rounded-2xl transition-colors"
                >
                    <Menu size={22} />
                </button>
                <div className="hidden md:flex items-center bg-nutri-main/50 backdrop-blur-md rounded-2xl px-5 py-2.5 w-80 border border-white/40 focus-within:ring-4 focus-within:ring-nutri-blue/10 focus-within:bg-nutri-main transition-all">
                    <Search size={18} className="text-nutri-text-dis" />
                    <input
                        type="text"
                        placeholder="Buscar paciente..."
                        className="bg-transparent border-none focus:outline-none text-sm ml-3 w-full text-nutri-text font-medium placeholder:text-nutri-text-dis"
                    />
                </div>
            </div>
            <div className="flex items-center gap-2 md:gap-5">
                <button className="p-3 text-nutri-text-sec hover:bg-nutri-main/50 rounded-2xl relative transition-all">
                    <Bell size={20} />
                    <span className="absolute top-3 right-3 w-2 h-2 bg-nutri-error rounded-full border-2 border-nutri-secondary"></span>
                </button>
                <div className="flex items-center gap-3.5 pl-2 md:pl-5 border-l border-nutri-text-dis/20">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-black text-nutri-text tracking-tight">{profile?.display_name || 'Usuário'}</p>
                        <button
                            onClick={() => supabase.auth.signOut()}
                            className="text-[10px] text-nutri-error font-black uppercase tracking-widest hover:opacity-70 transition-opacity"
                        >
                            Sair
                        </button>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-nutri-blue flex items-center justify-center text-white text-xs font-black shadow-nutri-soft rotate-3 overflow-hidden">
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
