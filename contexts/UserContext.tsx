import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

interface UserProfile {
  id: string;
  display_name: string;
  email: string;
  avatar_url?: string;
  logo_url?: string;
  signature_url?: string;
  specialty?: string;
  crn?: string;
  plans_limit?: string; // from "Premium Nutri" badge logic if applicable
}

interface UserContextType {
  profile: UserProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Tentar carregar do localStorage primeiro para persistência em modo dev
        const savedProfile = localStorage.getItem('nutriclin_dev_profile');
        if (savedProfile) {
          setProfile(JSON.parse(savedProfile));
        } else {
          // Fallback inicial se nada salvo
          const defaultDevProfile = {
            id: 'dev-user',
            email: 'dev@nutriclin.local',
            display_name: 'Usuário Dev',
            specialty: 'Nutricionista',
            crn: '',
          };
          setProfile(defaultDevProfile);
          localStorage.setItem('nutriclin_dev_profile', JSON.stringify(defaultDevProfile));
        }
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      }

      // Default values if profile empty
      setProfile({
        id: user.id,
        email: user.email || '',
        display_name: data?.display_name || user.user_metadata?.full_name || 'Usuário',
        avatar_url: data?.avatar_url,
        logo_url: data?.logo_url,
        signature_url: data?.signature_url,
        specialty: data?.specialty || 'Nutricionista',
        crn: data?.crn || '',
      });

    } catch (error) {
      console.error('Error in fetchProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
            fetchProfile();
        } else if (event === 'SIGNED_OUT') {
            setProfile(null);
            localStorage.removeItem('nutriclin_dev_profile');
        }
    });

    return () => {
        subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ profile, loading, refreshProfile: fetchProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
