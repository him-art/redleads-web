'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, Plus, X, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function SettingsTab({ profile, user }: { profile: any, user: any }) {
    const router = useRouter();
    // Strip https:// from initial value for display
    const stripProtocol = (url: string) => url ? url.replace(/^https?:\/\//i, '') : '';
    
    const [description, setDescription] = useState(profile?.description || '');
    const [keywords, setKeywords] = useState<string[]>(profile?.keywords || []);
    const [subreddits, setSubreddits] = useState<string[]>(profile?.subreddits || []);

    // Sync state if profile prop updates (e.g. after router.refresh)
    useEffect(() => {
        if (profile) {
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
    const [wasAiGenerated, setWasAiGenerated] = useState(false);
    const [pulseSections, setPulseSections] = useState(false);
    const supabase = createClient();

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
        if (!description || description.length < 10) {
            setStatusMsg({ type: 'error', text: 'Please provide a more detailed business description (at least 10 characters).' });
            return;
        }

        setAutofilling(true);
        setStatusMsg(null);
        try {
            const res = await fetch('/api/admin/autofill-settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    description: description
                }),
            });
            
            const data = await res.json();
            
            if (data.error) throw new Error(data.error);

            if (data.keywords || data.subreddits) {
                // 1. REPLACE INSTEAD OF APPEND
                // Clear existing before setting new
                setKeywords(data.keywords || []);
                setSubreddits(data.subreddits || []);
                
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

    const addKeyword = () => {
        const input = newKeyword.trim();
        if (!input) return;

        if (keywords.length >= 15) {
            setStatusMsg({ type: 'error', text: 'Maximum of 15 keywords allowed. Remove some to add more.' });
            return;
        }

        // Split by commas to allow bulk entry
        const newItems = input.split(',')
            .map(k => k.trim())
            .filter(k => k && !keywords.includes(k));

        if (newItems.length > 0) {
            // Respect the 15 limit even in bulk entry
            const spaceLeft = 15 - keywords.length;
            const toAdd = newItems.slice(0, spaceLeft);
            
            setKeywords([...keywords, ...toAdd]);
            setNewKeyword('');
            
            if (newItems.length > spaceLeft) {
                setStatusMsg({ type: 'error', text: `Only added ${spaceLeft} keywords. Limit of 15 reached.` });
            }
        }
    };

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
                        <label className="block text-sm font-bold text-gray-300 mb-2">Business Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g., B2B SaaS platform that helps sales teams automate outreach and track leads"
                            rows={5}
                            className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-orange-500 outline-none transition-colors resize-none"
                        />
                        <p className="text-xs text-gray-500 mt-2">Describe your business, target customers, and what problems you solve</p>
                    </div>

                    <button
                        onClick={handleAutofill}
                        disabled={autofilling || !description || description.length < 10}
                        className="w-full py-4 bg-orange-500 text-black rounded-xl text-sm font-black uppercase tracking-widest hover:bg-orange-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {autofilling ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                <span>Generating Configuration...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles size={20} />
                                <span>Generate Configuration with AI</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Keywords */}
                <div className="rounded-2xl -m-4 p-4 transition-colors duration-500">
                    <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                            <label className="block text-sm font-bold text-gray-300">Priority Keywords</label>
                            {wasAiGenerated && (
                                <span className="text-[11px] font-medium text-gray-500 flex items-center gap-1 animate-in fade-in zoom-in duration-500">
                                    <Sparkles size={10} className="text-orange-500/50" />
                                    AI selected
                                </span>
                            )}
                        </div>
                        <span className={`text-[10px] font-bold ${keywords.length >= 15 ? 'text-orange-500' : 'text-gray-600'}`}>
                            {keywords.length}/15
                        </span>
                    </div>
                    <p className="text-xs text-gray-500/80 mb-3 leading-relaxed">
                        {wasAiGenerated 
                            ? "AI selected these keywords — add or remove as needed" 
                            : "Enter keywords and phrases (separated by commas) that describe your business, solutions, and pain points your ICP discusses"}
                    </p>
                    <div className="flex gap-2 mb-3">
                        <input
                            type="text"
                            value={newKeyword}
                            onChange={(e) => setNewKeyword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addKeyword()}
                            placeholder="e.g. 'lead generation', 'sales automation', 'cold email outreach', 'B2B SaaS'"
                            className="flex-grow bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 outline-none placeholder:text-gray-700"
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
                <div className="rounded-2xl -m-4 p-4 transition-colors duration-500 mt-2">
                    <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                            <label className="block text-sm font-bold text-gray-300">Target Subreddits</label>
                            {wasAiGenerated && (
                                <span className="text-[11px] font-medium text-gray-500 flex items-center gap-1 animate-in fade-in zoom-in duration-500">
                                    <Sparkles size={10} className="text-orange-500/50" />
                                    AI selected
                                </span>
                            )}
                        </div>
                        <span className={`text-[10px] font-bold ${subreddits.length >= 10 ? 'text-orange-500' : 'text-gray-600'}`}>
                            {subreddits.length}/10
                        </span>
                    </div>
                    <p className="text-xs text-gray-500/80 mb-3 leading-relaxed">
                        {wasAiGenerated 
                            ? "AI selected these communities — add or remove as needed" 
                            : "Communities where your ideal customers and competitors are active"}
                    </p>
                    <div className="flex gap-2 mb-3">
                        <div className="relative flex-grow">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-bold">r/</div>
                            <input
                                type="text"
                                value={newSubreddit}
                                onChange={(e) => setNewSubreddit(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addSubreddit()}
                                placeholder="solopreneur"
                                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 pl-8 text-white focus:border-orange-500 outline-none placeholder:text-gray-700"
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

