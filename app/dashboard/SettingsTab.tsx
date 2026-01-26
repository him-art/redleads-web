'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, Plus, X, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function SettingsTab({ profile, user }: { profile: any, user: any }) {
    const router = useRouter();
    // Strip https:// from initial value for display
    const stripProtocol = (url: string) => url ? url.replace(/^https?:\/\//i, '') : '';
    
    const [websiteUrl, setWebsiteUrl] = useState(stripProtocol(profile?.website_url || ''));
    const [description, setDescription] = useState(profile?.description || '');
    const [keywords, setKeywords] = useState<string[]>(profile?.keywords || []);
    const [subreddits, setSubreddits] = useState<string[]>(profile?.subreddits || []);

    // Sync state if profile prop updates (e.g. after router.refresh)
    useEffect(() => {
        if (profile) {
            setWebsiteUrl(stripProtocol(profile.website_url || ''));
            setDescription(profile.description || '');
            setKeywords(profile.keywords || []);
            setSubreddits(profile.subreddits || []);
        }
    }, [profile]);
    
    // Inputs for adding new items
    const [newKeyword, setNewKeyword] = useState('');
    const [newSubreddit, setNewSubreddit] = useState('');

    const [saving, setSaving] = useState(false);
    const [autofilling, setAutofilling] = useState(false);
    const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const supabase = createClient();

    const handleSave = async () => {
        setSaving(true);
        setStatusMsg(null);
        // Add protocol back before saving
        const finalUrl = websiteUrl ? `https://${websiteUrl}` : '';
        
        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    email: user.email,
                    website_url: finalUrl,
                    description: description,
                    keywords: keywords,
                    subreddits: subreddits
                });

            if (error) throw error;
            router.refresh(); // Sync with server
            setStatusMsg({ type: 'success', text: 'Configuration saved successfully!' });
            setTimeout(() => setStatusMsg(null), 3000);
        } catch (err: any) {
            console.error('Save error:', err);
            setStatusMsg({ type: 'error', text: 'Error saving: ' + err.message });
        } finally {
            setSaving(false);
        }
    };

    const handleAutofill = async () => {
        if (!websiteUrl || !description) {
            setStatusMsg({ type: 'error', text: 'Please enter both website URL and a short description first.' });
            return;
        }

        setAutofilling(true);
        setStatusMsg(null);
        try {
            const res = await fetch('/api/admin/autofill-settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    url: `https://${websiteUrl}`,
                    description: description
                }),
            });
            
            const data = await res.json();
            
            if (data.error) throw new Error(data.error);

            if (data.description) {
                setDescription(data.description);
            }
            if (data.keywords) {
                // Ensure AI results are also single-word
                const cleanKws = data.keywords
                    .filter((k: string) => k && !k.includes(' '))
                    .map((k: string) => k.trim());
                const uniqueKws = Array.from(new Set([...keywords, ...cleanKws]));
                setKeywords(uniqueKws);
            }
            if (data.subreddits) {
                const uniqueSubs = Array.from(new Set([...subreddits, ...data.subreddits]));
                setSubreddits(uniqueSubs);
            }
        } catch (err: any) {
            alert('Error generating suggestions: ' + err.message);
        } finally {
            setAutofilling(false);
        }
    };

    const addKeyword = () => {
        const cleanKw = newKeyword.trim();
        if (cleanKw.includes(' ')) {
            alert('Keywords must be single words only.');
            return;
        }
        if (cleanKw && !keywords.includes(cleanKw)) {
            setKeywords([...keywords, cleanKw]);
            setNewKeyword('');
        }
    };

    const addSubreddit = () => {
        // Remove r/ prefix if present
        const cleanSub = newSubreddit.replace(/^r\//i, '').trim();
        if (cleanSub && !subreddits.includes(cleanSub)) {
            setSubreddits([...subreddits, cleanSub]);
            setNewSubreddit('');
        }
    };

    const removeKeyword = (index: number) => {
        setKeywords(keywords.filter((_, i) => i !== index));
    };

    const removeSubreddit = (index: number) => {
        setSubreddits(subreddits.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-8 max-w-2xl">
            <div>
                <h2 className="text-2xl font-bold mb-2">Tracking Configuration</h2>
                <p className="text-gray-400">Tell us what to scan for. We use this to fine-tune your daily reports.</p>
            </div>

            <div className="space-y-6">
                {/* Website URL */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Primary Website URL</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium pointer-events-none">
                                https://
                            </div>
                            <input
                                type="text"
                                value={websiteUrl}
                                onChange={(e) => setWebsiteUrl(stripProtocol(e.target.value))}
                                placeholder="yourstartup.com"
                                className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-20 pr-4 text-white focus:border-orange-500 outline-none transition-colors"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">We analyze this page to understand your value proposition.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Short Business Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g. We provide cold email automation for B2B startups."
                            rows={2}
                            className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-orange-500 outline-none transition-colors resize-none"
                        />
                        <p className="text-xs text-gray-500 mt-2">This helps our AI bouncer filter for high-intent Reddit posts.</p>
                    </div>

                    <button
                        onClick={handleAutofill}
                        disabled={autofilling || !websiteUrl || !description}
                        className="px-6 py-2 border border-orange-500 rounded-full text-xs font-black uppercase tracking-widest text-orange-500 hover:bg-orange-500 hover:text-black transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        {autofilling ? 'AI is analyzing your site...' : 'Fill with AI'}
                    </button>
                </div>

                {/* Keywords */}
                <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Priority Keywords</label>
                    <div className="flex gap-2 mb-3">
                        <input
                            type="text"
                            value={newKeyword}
                            onChange={(e) => setNewKeyword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addKeyword()}
                            placeholder="e.g. 'inventory', 'churn', 'outreach'"
                            className="flex-grow bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 outline-none"
                        />
                        <button 
                            onClick={addKeyword}
                            className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl transition-colors"
                        >
                            <Plus size={20} />
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {keywords.map((kw, i) => (
                            <div key={i} className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-500 px-3 py-1.5 rounded-full text-sm font-medium">
                                <span>{kw}</span>
                                <button onClick={() => removeKeyword(i)} className="text-orange-500/50 hover:text-orange-500">
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Subreddits */}
                <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Target Subreddits</label>
                    <div className="flex gap-2 mb-3">
                        <div className="relative flex-grow">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-bold">r/</div>
                            <input
                                type="text"
                                value={newSubreddit}
                                onChange={(e) => setNewSubreddit(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addSubreddit()}
                                placeholder="solopreneur"
                                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 pl-8 text-white focus:border-orange-500 outline-none"
                            />
                        </div>
                        <button 
                            onClick={addSubreddit}
                            className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl transition-colors"
                        >
                            <Plus size={20} />
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {subreddits.map((sub, i) => (
                            <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-sm">
                                <span className="text-gray-500 font-bold">r/</span>
                                <span>{sub}</span>
                                <button onClick={() => removeSubreddit(i)} className="text-gray-500 hover:text-red-500 ml-1">
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-4 border-t border-white/5 space-y-4">
                    {statusMsg && (
                        <div className={`p-4 rounded-xl text-sm font-bold animate-in fade-in slide-in-from-bottom-2 ${
                            statusMsg.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                        }`}>
                            {statusMsg.text}
                        </div>
                    )}
                    
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        {saving ? 'Saving Changes...' : 'Save Configuration'}
                    </button>
                </div>
            </div>
        </div>
    );
}

