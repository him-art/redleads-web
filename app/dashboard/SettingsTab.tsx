'use client';

import { useState, useEffect, useMemo } from 'react';
import { Compass, MessageSquarePlus, Sparkles, Plus, X, Save } from 'lucide-react';
import LoadingIcon from '@/components/ui/LoadingIcon';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useDashboardData } from './DashboardDataContext';

export default function SettingsTab({ user }: { user: any }) {
    const { profile, planDetails } = useDashboardData();
    const router = useRouter();
    // Strip https:// from initial value for display
    const stripProtocol = (url: string) => url ? url.replace(/^https?:\/\//i, '') : '';
    
    const [description, setDescription] = useState(profile?.description || '');
    const [keywords, setKeywords] = useState<string[]>(profile?.keywords || []);
    const [subreddits, setSubreddits] = useState<string[]>(profile?.user_metadata?.subreddits || []);
    const [websiteUrl, setWebsiteUrl] = useState(profile?.website_url || '');


    // Sync state if profile prop updates (e.g. after router.refresh)
    useEffect(() => {
        if (profile) {
            setDescription(profile.description || '');
            setKeywords(profile.keywords || []);
            setSubreddits(profile.user_metadata?.subreddits || []);
            setWebsiteUrl(profile.website_url || '');
        }
    }, [profile]);
    
    // Inputs for adding new items
    const [newKeyword, setNewKeyword] = useState('');
    const [newSubreddit, setNewSubreddit] = useState('');


    const [saving, setSaving] = useState(false);
    const [autofilling, setAutofilling] = useState(false);
    const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [wasAiGenerated, setWasAiGenerated] = useState(false);
    const [pulseSections, setPulseSections] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => { setIsMounted(true); }, []);
    const supabase = useMemo(() => createClient(), []);

    const handleSave = async () => {
        setSaving(true);
        setStatusMsg(null);
        
        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    email: user.email,
                    description: description,
                    keywords: keywords,
                    website_url: websiteUrl,
                    user_metadata: {
                        ...(profile?.user_metadata || {}),
                        subreddits: subreddits
                    }
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
        if (!websiteUrl || websiteUrl.length < 3) {
            setStatusMsg({ type: 'error', text: 'Please provide a valid website URL to generate configuration.' });
            return;
        }

        setAutofilling(true);
        setStatusMsg(null);
        try {
            const res = await fetch('/api/onboarding/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    url: websiteUrl,
                    limit: keywordLimit
                }),
            });
            
            const data = await res.json();
            
            if (data.error) throw new Error(data.error);

            if (data.description || data.keywords || data.subreddits) {
                // 1. REPLACE INSTEAD OF APPEND
                if (data.description) setDescription(data.description);
                setKeywords(data.keywords || []);
                
                if (isPaid && data.subreddits) {
                    // Respect the limit for AI suggestions too
                    setSubreddits(data.subreddits.slice(0, subredditLimit));
                }

                // 2. SUCCESS FEEDBACK
                setWasAiGenerated(true);
                setPulseSections(true);
                
                // Clear pulsing after delay
                setTimeout(() => {
                    setPulseSections(false);
                }, 4000);
            }
        } catch (err: any) {
            alert('Error generating suggestions: ' + err.message);
        } finally {
            setAutofilling(false);
        }
    };

    // Determine keyword limit from reactive planDetails
    const keywordLimit = planDetails?.keywordLimit || 10;
    const subredditLimit = planDetails?.subredditLimit || 0;
    const isPaid = planDetails?.id !== 'trial';

    const addKeyword = () => {
        const input = newKeyword.trim();
        if (!input) return;

        if (keywords.length >= keywordLimit) {
            setStatusMsg({ type: 'error', text: `Maximum of ${keywordLimit} keywords allowed for your plan. Upgrade for more.` });
            return;
        }

        // Split by commas to allow bulk entry
        const newItems = input.split(',')
            .map(k => k.trim())
            .filter(k => k && !keywords.includes(k));

        if (newItems.length > 0) {
            // Respect the limit even in bulk entry
            const spaceLeft = keywordLimit - keywords.length;
            const toAdd = newItems.slice(0, spaceLeft);
            
            setKeywords([...keywords, ...toAdd]);
            setNewKeyword('');
            
            if (newItems.length > spaceLeft) {
                setStatusMsg({ type: 'error', text: `Only added ${toAdd.length} keywords. Limit of ${keywordLimit} reached.` });
            }
        }
    };

    const removeKeyword = (index: number) => {
        setKeywords(keywords.filter((_, i) => i !== index));
    };

    const addSubreddit = () => {
        if (!isPaid) {
            setStatusMsg({ type: 'error', text: 'Custom subreddit monitoring is only available for paid plans.' });
            return;
        }

        if (subreddits.length >= subredditLimit) {
            setStatusMsg({ type: 'error', text: `Maximum of ${subredditLimit} subreddits allowed for your plan. Upgrade for more.` });
            return;
        }

        const input = newSubreddit.trim().replace(/^r\//i, '');
        if (!input) return;

        if (!subreddits.includes(input)) {
            setSubreddits([...subreddits, input]);
            setNewSubreddit('');
        }
    };
    
    const removeSubreddit = (index: number) => {
        setSubreddits(subreddits.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-8 max-w-2xl">
            <div className="flex items-center gap-3 mb-8">
                <div className="relative flex items-center justify-center">
                    <Compass className="text-primary" size={18} />
                    <div className="absolute inset-0 bg-primary/5 rounded-full" />
                </div>
                <div className="space-y-0.5">
                    <h2 className="text-[10px] font-black tracking-[0.2em] text-text-secondary uppercase">configuration</h2>
                    <p className="text-sm font-bold text-text-primary tracking-tight">Tracking Radar</p>
                </div>
            </div>

            <div className="space-y-6">
                {/* Website URL */}
                <div className="p-0.5 surface-1 rounded-2xl transition-all duration-300">
                    <div className="bg-void p-6 rounded-[1.1rem] border border-white/5 relative overflow-hidden space-y-4">
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label htmlFor="website-url" className="text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary">Website URL</label>
                            </div>
                            <div className="relative group">
                                <input
                                    id="website-url"
                                    name="url"
                                    type="text"
                                    value={websiteUrl}
                                    onChange={(e) => setWebsiteUrl(e.target.value)}
                                    placeholder="yourproduct.com"
                                    className="w-full bg-surface border border-white/10 rounded-xl py-4 pl-4 pr-4 text-sm font-bold text-text-primary tracking-tight focus:border-primary/50 outline-none transition-all placeholder:text-text-secondary/50"
                                />
                            </div>
                            <p className="text-[9px] text-text-secondary/40 leading-relaxed uppercase tracking-widest font-black">
                                Used to pre-fill Power Searches and generate AI configuration
                            </p>
                        </div>

                        <button
                            onClick={handleAutofill}
                            disabled={autofilling || !websiteUrl || websiteUrl.length < 3}
                            className="w-full py-4 bg-primary text-white rounded-xl text-[10px] sm:text-sm font-black uppercase tracking-[0.2em] hover:bg-primary/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-[0_8px_30px_rgba(255,88,54,0.15)] group"
                        >
                            {autofilling ? (
                                <>
                                    <LoadingIcon className="w-5 h-5" />
                                    <span>Generating Intelligence...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
                                    <span>Generate AI setup</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Product Description */}
                <div className="p-0.5 surface-1 rounded-2xl">
                    <div className="bg-void p-6 rounded-[1.1rem] border border-white/5 relative overflow-hidden space-y-4">
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label htmlFor="product-description" className="text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary">Product Description</label>
                                <span className={`text-[9px] font-black uppercase tracking-widest ${description.split(/\s+/).filter(Boolean).length > 150 ? 'text-red-500' : 'text-text-secondary/40'}`}>
                                    {description.split(/\s+/).filter(Boolean).length}/150 words
                                </span>
                            </div>
                            <textarea
                                id="product-description"
                                name="description"
                                value={description}
                                onChange={(e) => {
                                    const words = e.target.value.split(/\s+/).filter(Boolean);
                                    if (words.length <= 150 || e.target.value.length < description.length) {
                                        setDescription(e.target.value);
                                    }
                                }}
                                placeholder="[Brand Name] is a [Product Type] that helps [Target Audience] solve [Problem] by [Value Proposition]."
                                rows={5}
                                className="w-full bg-surface border border-white/10 rounded-xl p-4 text-sm font-bold text-text-primary tracking-tight focus:border-primary/50 outline-none transition-colors resize-none placeholder:text-text-secondary/50 min-h-[140px]"
                            />
                            <p className="text-[9px] text-text-secondary/40 leading-relaxed uppercase tracking-widest font-black">
                                <span className="text-primary">Pro Tip:</span> Being specific helps the AI find higher quality leads.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Keywords */}
                <div className="p-0.5 surface-1 rounded-[1.5rem]">
                    <div className="bg-void p-6 rounded-[1.3rem] border border-white/5 relative overflow-hidden transition-colors duration-500">
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary">Priority Keywords</label>
                                {isMounted && wasAiGenerated && (
                                    <span className="ai-badge animate-in fade-in zoom-in duration-500">
                                        <Sparkles size={10} />
                                        AI Intelligence
                                    </span>
                                )}
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-widest ${keywords.length >= keywordLimit ? 'text-primary' : 'text-text-secondary/40'}`}>
                                {keywords.length}/{keywordLimit}
                            </span>
                        </div>
                        <p className="text-[9px] text-text-secondary/40 leading-relaxed uppercase tracking-widest font-black mb-4">
                            We scan 100+ active SaaS & Tech subreddits for these keywords.
                        </p>
                        <div className="flex gap-2 mb-3">
                            <input
                                id="new-keyword-input"
                                name="new-keyword"
                                type="text"
                                value={newKeyword}
                                onChange={(e) => setNewKeyword(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addKeyword()}
                                placeholder="e.g. 'lead generation', 'cold outreach'"
                                className="flex-grow bg-surface border border-white/10 rounded-xl p-3 text-sm font-bold text-text-primary tracking-tight focus:border-primary/50 outline-none placeholder:text-text-secondary/50"
                            />
                            <button 
                                onClick={addKeyword}
                                className="bg-surface hover:bg-white/10 text-text-primary p-3 rounded-xl transition-colors flex items-center justify-center border border-white/10"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {keywords.map((kw, i) => (
                                <div key={i} className="flex items-center gap-2 bg-primary/5 border border-primary/10 text-primary px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">
                                    <span>{kw}</span>
                                    <button onClick={() => removeKeyword(i)} className="text-primary/50 hover:text-primary transition-colors flex items-center justify-center">
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Custom Subreddits Section */}
                <div className="p-0.5 surface-1 rounded-2xl">
                    <div className="bg-void p-6 rounded-[1.1rem] border border-white/5 relative overflow-hidden space-y-4">
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary">Custom Subreddits</label>
                                {!isPaid ? (
                                    <span className="text-[9px] font-black bg-primary/10 text-primary/80 px-2 py-0.5 rounded-full border border-primary/10 uppercase tracking-widest flex items-center gap-1">
                                        <Sparkles size={8} />
                                        PRO
                                    </span>
                                ) : (
                                    isMounted && wasAiGenerated && (
                                        <span className="ai-badge animate-in fade-in zoom-in duration-500">
                                            <Sparkles size={10} />
                                            AI Intelligence
                                        </span>
                                    )
                                )}
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-widest ${subreddits.length >= subredditLimit ? 'text-primary' : 'text-text-secondary/40'}`}>
                                {subreddits.length}/{subredditLimit}
                            </span>
                        </div>

                        <p className="text-[9px] text-text-secondary/40 leading-relaxed uppercase tracking-widest font-black">
                            Monitor specific communities in addition to our master list.
                        </p>

                        {!isPaid ? (
                            <div 
                                className="bg-surface border border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-center gap-3 cursor-pointer group hover:border-primary/30 transition-all"
                                onClick={() => router.push('/#pricing')}
                            >
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <Sparkles size={20} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-text-primary uppercase tracking-wider">Unlock Custom Monitoring</p>
                                    <p className="text-[9px] text-text-secondary font-black uppercase tracking-widest">Upgrade to Starter or Growth</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex gap-2">
                                    <div className="relative flex-grow">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary/50 text-xs font-bold font-mono">r/</span>
                                        <input
                                            id="new-subreddit-input"
                                            name="new-subreddit"
                                            type="text"
                                            value={newSubreddit}
                                            onChange={(e) => setNewSubreddit(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && addSubreddit()}
                                            disabled={subreddits.length >= subredditLimit}
                                            placeholder="SaaS"
                                            className="w-full bg-surface border border-white/10 rounded-xl py-3 pl-8 pr-3 text-sm font-bold text-text-primary tracking-tight focus:border-primary/50 outline-none placeholder:text-text-secondary/50"
                                        />
                                    </div>
                                    <button 
                                        onClick={addSubreddit}
                                        disabled={subreddits.length >= subredditLimit}
                                        className="bg-surface hover:bg-white/10 text-text-primary p-3 rounded-xl transition-colors flex items-center justify-center disabled:opacity-30 border border-white/10"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {subreddits.map((sub, i) => (
                                        <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/10 text-text-primary px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">
                                            <span>r/{sub}</span>
                                            <button onClick={() => removeSubreddit(i)} className="text-text-secondary hover:text-white transition-colors flex items-center justify-center">
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="pt-4 border-t border-white/5 space-y-4">
                    {statusMsg && (
                        <div className={`flex items-center justify-between p-3 rounded-xl text-xs font-bold animate-in fade-in slide-in-from-bottom-2 ${
                            statusMsg.type === 'success' ? 'bg-green-900/20 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500'
                        }`}>
                            <span>{statusMsg.text}</span>
                            <button onClick={() => setStatusMsg(null)} className="ml-2 hover:opacity-70 transition-opacity flex items-center justify-center">
                                <X size={14} />
                            </button>
                        </div>
                    )}
                    
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {saving ? <LoadingIcon className="w-5 h-5" /> : <Save size={20} />}
                        {saving ? 'Saving Changes...' : 'Save Configuration'}
                    </button>
                </div>
            </div>
        </div>
    );
}

