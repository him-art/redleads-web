'use client';

import { useState, useEffect, useMemo } from 'react';
import { Save, Loader2, Plus, X, Sparkles, MessageSquarePlus, Compass } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function SettingsTab({ profile, user }: { profile: any, user: any }) {
    const router = useRouter();
    // Strip https:// from initial value for display
    const stripProtocol = (url: string) => url ? url.replace(/^https?:\/\//i, '') : '';
    
    const [description, setDescription] = useState(profile?.description || '');
    const [keywords, setKeywords] = useState<string[]>(profile?.keywords || []);
    const [websiteUrl, setWebsiteUrl] = useState(profile?.website_url || '');


    // Sync state if profile prop updates (e.g. after router.refresh)
    useEffect(() => {
        if (profile) {
            setDescription(profile.description || '');
            setKeywords(profile.keywords || []);
            setWebsiteUrl(profile.website_url || '');
        }
    }, [profile]);
    
    // Inputs for adding new items
    const [newKeyword, setNewKeyword] = useState('');


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
                    // subreddits: subreddits -- Deprecated in favor of global monitoring
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

            if (data.description || data.keywords) {
                // 1. REPLACE INSTEAD OF APPEND
                if (data.description) setDescription(data.description);
                setKeywords(data.keywords || []);

                
                // 2. SUCCESS FEEDBACK
                setWasAiGenerated(true);
                setPulseSections(true);
                setStatusMsg({ type: 'success', text: '✓ Configuration generated! Review and edit as needed.' });
                
                // Clear pulsing and reset message after delay
                setTimeout(() => {
                    setPulseSections(false);
                    setStatusMsg(null);
                }, 4000);
            }
        } catch (err: any) {
            alert('Error generating suggestions: ' + err.message);
        } finally {
            setAutofilling(false);
        }
    };

    // Determine keyword limit
    const getKeywordLimit = () => {
        if (profile?.subscription_tier === 'lifetime') return 50;
        if (profile?.subscription_tier === 'starter') return 5;
        return 15; // Pro & Trial limit
    };
    const keywordLimit = getKeywordLimit();

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

    /*
    const addSubreddit = () => {
        if (subreddits.length >= 10) {
            setStatusMsg({ type: 'error', text: 'Maximum of 10 subreddits allowed. Remove some to add more.' });
            return;
        }

        // Remove r/ prefix if present
        const cleanSub = newSubreddit.replace(/^r\//i, '').trim();
        if (cleanSub && !subreddits.includes(cleanSub)) {
            setSubreddits([...subreddits, cleanSub]);
            setNewSubreddit('');
        }
    };
    
    const removeSubreddit = (index: number) => {
        setSubreddits(subreddits.filter((_, i) => i !== index));
    };
    */

    return (
        <div className="space-y-8 max-w-2xl">
            <div className="flex items-center gap-3 mb-8">
                <div className="relative">
                    <Compass className="text-primary" size={18} />
                    <div className="absolute inset-0 bg-primary/20 blur-md animate-pulse rounded-full" />
                </div>
                <div className="space-y-0.5">
                    <h2 className="text-[10px] font-black tracking-[0.2em] text-text-secondary uppercase">configuration</h2>
                    <p className="text-sm font-bold text-text-primary tracking-tight">Tracking Radar</p>
                </div>
            </div>

            <div className="space-y-6">
                {/* Website URL */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label htmlFor="website-url" className="text-[9px] font-bold uppercase tracking-[0.2em] text-text-secondary">Website URL</label>
                        </div>
                        <div className="relative group">
                            <input
                                id="website-url"
                                name="url"
                                type="text"
                                value={websiteUrl}
                                onChange={(e) => setWebsiteUrl(e.target.value)}
                                placeholder="yourproduct.com"
                                className="w-full bg-black/20 border border-border-subtle rounded-xl py-4 pl-4 pr-4 text-sm font-bold text-text-primary tracking-tight focus:border-primary/50 outline-none transition-all placeholder:text-text-secondary/50 shadow-inner"
                            />
                        </div>
                        <p className="text-[10px] text-text-secondary/60 leading-relaxed uppercase tracking-widest font-black opacity-60">
                            Used to pre-fill Power Searches and generate AI configuration
                        </p>
                    </div>

                    <button
                        onClick={handleAutofill}
                        disabled={autofilling || !websiteUrl || websiteUrl.length < 3}
                        className="w-full py-4 bg-primary text-white rounded-xl text-[10px] sm:text-sm font-black uppercase tracking-[0.2em] hover:bg-primary/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,88,54,0.2)]"
                    >
                        {autofilling ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                <span>Generating Configuration...</span>
                            </>
                        ) : (
                            <>
                                <MessageSquarePlus size={20} />
                                <span>Generate description & keywords using AI</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Product Description */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label htmlFor="product-description" className="text-[9px] font-bold uppercase tracking-[0.2em] text-text-secondary">Product Description</label>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${description.split(/\s+/).filter(Boolean).length > 150 ? 'text-red-500' : 'text-text-secondary/60'}`}>
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
                            className="w-full bg-black/20 border border-border-subtle rounded-xl p-4 text-sm font-bold text-text-primary tracking-tight focus:border-primary/50 outline-none transition-colors resize-none placeholder:text-text-secondary/50 shadow-inner"
                        />
                        <p className="text-[10px] text-text-secondary/60 leading-relaxed uppercase tracking-widest font-black opacity-60">
                            <span className="text-primary/80">Pro Tip:</span> Being highly specific helps the AI find much higher quality leads.
                        </p>
                    </div>
                </div>

                {/* Keywords */}
                <div className="rounded-2xl -m-4 p-4 transition-colors duration-500">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-text-secondary">Priority Keywords</label>
                            {isMounted && wasAiGenerated && (
                                <span className="text-[9px] font-black uppercase tracking-widest text-primary/60 flex items-center gap-1 animate-in fade-in zoom-in duration-500">
                                    <Sparkles size={8} className="text-primary" />
                                    AI selected
                                </span>
                            )}
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${keywords.length >= keywordLimit ? 'text-primary' : 'text-text-secondary/60'}`}>
                            {keywords.length}/{keywordLimit}
                        </span>
                    </div>
                    <p className="text-[10px] text-text-secondary/60 leading-relaxed uppercase tracking-widest font-black opacity-60 mb-4">
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
                            placeholder="Best results with 2-word phrases: 'lead generation', 'sales automation', 'cold outreach'"
                            className="flex-grow bg-black/20 border border-border-subtle rounded-xl p-3 text-sm font-bold text-text-primary tracking-tight focus:border-primary/50 outline-none placeholder:text-text-secondary/50 shadow-inner"
                        />
                        <button 
                            onClick={addKeyword}
                            className="bg-white/10 hover:bg-white/20 text-text-primary p-3 rounded-xl transition-colors"
                        >
                            <Plus size={20} />
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {keywords.map((kw, i) => (
                            <div key={i} className="flex items-center gap-2 bg-primary/5 border border-primary/10 text-primary px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">
                                <span>{kw}</span>
                                <button onClick={() => removeKeyword(i)} className="text-primary/50 hover:text-primary transition-colors">
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Subreddits Section Removed - Global Monitoring Active */}
                <div className="rounded-2xl -m-4 p-4 mt-2 opacity-30 pointer-events-none grayscale">
                    <div className="flex items-center gap-2 mb-2">
                        <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-text-secondary">Global Monitoring Active</label>
                        <span className="text-[9px] font-black bg-green-500/10 text-green-500/60 px-2 py-0.5 rounded-full border border-green-500/10 uppercase tracking-widest">100+ Communities</span>
                    </div>
                     <p className="text-[10px] text-text-secondary/60 leading-relaxed uppercase tracking-widest font-black">
                        Automatically scanning all relevant communities for founders and SaaS signals.
                    </p>
                </div>

                <div className="pt-4 border-t border-white/5 space-y-4">
                    {statusMsg && (
                        <div className={`flex items-center justify-between p-3 rounded-xl text-xs font-bold animate-in fade-in slide-in-from-bottom-2 ${
                            statusMsg.type === 'success' ? 'bg-green-900/20 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500'
                        }`}>
                            <span>{statusMsg.text}</span>
                            <button onClick={() => setStatusMsg(null)} className="ml-2 hover:opacity-70 transition-opacity">
                                <X size={14} />
                            </button>
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

