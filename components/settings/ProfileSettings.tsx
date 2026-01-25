
import React, { useState } from 'react';
import { User, Mail, Smartphone, Award, Camera, Loader2 } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { storageService } from '../../services/storageService';
import { supabase } from '../../services/supabaseClient';
import Input from '../ui/Input';

const ProfileSettings: React.FC = () => {
    const { profile, refreshProfile } = useUser();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: profile?.display_name || '',
        email: profile?.email || '',
        crn: profile?.crn || '',
        specialty: profile?.specialty || '',
        phone: profile?.contacts?.phone || '',
        bio: profile?.contacts?.bio || ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !profile) return;

        try {
            setUploading(true);
            const compressed = await storageService.compressImage(file);
            const fileName = `avatar-${profile.id}-${Date.now()}.webp`;
            const publicUrl = await storageService.uploadFile(compressed, {
                bucket: 'nutriclin-media',
                path: `avatars/${fileName}`,
                oldPath: profile.avatar_url || undefined
            });

            const { error } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', profile.id);

            if (error) throw error;
            await refreshProfile();
            alert("Foto de perfil atualizada!");
        } catch (err: any) {
            console.error(err);
            alert("Erro ao subir imagem: " + err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        if (!profile) return;
        try {
            setLoading(true);
            const { error } = await supabase
                .from('profiles')
                .update({
                    display_name: formData.name,
                    crn: formData.crn,
                    specialty: formData.specialty,
                    contacts: {
                        phone: formData.phone,
                        bio: formData.bio
                    }
                })
                .eq('id', profile.id);

            if (error) throw error;
            await refreshProfile();
            alert("Perfil atualizado com sucesso!");
        } catch (err: any) {
            console.error(err);
            alert("Erro ao salvar: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-display font-bold text-slate-warm-800">Dados Profissionais</h2>
                <p className="text-slate-warm-500">Gerencie suas informações públicas e credenciais.</p>
            </div>

            {/* Avatar & Basic Info */}
            <div className="bg-white rounded-2xl border border-cream-200 shadow-soft-sm p-8 flex flex-col md:flex-row items-center gap-8">
                <div className="relative group">
                    <input
                        type="file"
                        id="avatar-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        disabled={uploading}
                    />
                    <label htmlFor="avatar-upload" className="block relative cursor-pointer group">
                        <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-md overflow-hidden ring-2 ring-cream-300">
                            {uploading ? (
                                <div className="w-full h-full flex items-center justify-center bg-white/50">
                                    <Loader2 className="animate-spin text-coral-500" />
                                </div>
                            ) : profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <User size={40} />
                                </div>
                            )}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 rounded-full transition-opacity">
                            <Camera size={24} />
                        </div>
                    </label>
                </div>
                <div className="flex-1 space-y-4 w-full text-center md:text-left">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Nome de Exibição" name="name" value={formData.name} onChange={handleChange} />
                        <Input label="CRN / Registro Profissional" name="crn" value={formData.crn} onChange={handleChange} />
                    </div>
                </div>
            </div>

            {/* Detailed Info */}
            <div className="bg-white rounded-2xl border border-cream-200 shadow-soft-sm p-8 space-y-6">
                <h3 className="font-bold text-lg text-slate-warm-800 border-b border-cream-100 pb-2 mb-4">Informações de Contato & Especialização</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="E-mail Profissional" name="email" value={formData.email} onChange={handleChange} type="email" icon={<Mail size={16} />} />
                    <Input label="Celular / WhatsApp" name="phone" value={formData.phone} onChange={handleChange} icon={<Smartphone size={16} />} />
                </div>

                <div>
                    <Input label="Especialidade Principal" name="specialty" value={formData.specialty} onChange={handleChange} icon={<Award size={16} />} />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-warm-400 uppercase tracking-wider block">Bio Profissional</label>
                    <textarea
                        name="bio"
                        rows={4}
                        value={formData.bio}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-slate-warm-800 font-medium focus:outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-100 transition-all resize-none"
                        placeholder="Mini biografia para o perfil público..."
                    />
                    <p className="text-[10px] text-slate-warm-400 text-right">{formData.bio.length}/500</p>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    onClick={handleSave}
                    disabled={loading || uploading}
                    className="px-8 py-3 rounded-xl bg-coral-500 text-white font-bold hover:bg-coral-600 transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50 flex items-center gap-2"
                >
                    {loading && <Loader2 size={18} className="animate-spin" />}
                    Salvar Alterações
                </button>
            </div>
        </div>
    );
};

export default ProfileSettings;
