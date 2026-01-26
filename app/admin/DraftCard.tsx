'use client';

import { useState } from 'react';
import { Send, Edit, Trash2, Eye } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function DraftCard({ draft }: { draft: any }) {
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [discarding, setDiscarding] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const supabase = createClient();

    const handleSend = async () => {
        if (!confirm('Are you sure you want to send this email?')) return;
        setSending(true);

        try {
            const res = await fetch('/api/admin/send-draft', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ draft_id: draft.id }),
            });
            
            if (!res.ok) throw new Error('Failed to send');
            
            setSent(true);
        } catch (error) {
            alert('Error sending email');
        } finally {
            setSending(false);
        }
    };

    const handleDiscard = async () => {
        if (!confirm('Are you sure you want to discard this report?')) return;
        setDiscarding(true);

        try {
            const { error } = await supabase
                .from('email_drafts')
                .delete()
                .eq('id', draft.id);
            
            if (error) throw error;
            setSent(true); // Effectively removes it from view
        } catch (error: any) {
            alert('Error discarding draft: ' + error.message);
        } finally {
            setDiscarding(false);
        }
    };

    if (sent) return null; // Remove from view after sending or discarding

    return (
        <div className="bg-[#1a1a1a] rounded-xl border border-white/5 overflow-hidden transition-all hover:border-white/10">
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="font-bold text-lg text-white mb-1">{draft.subject}</h3>
                        <p className="text-sm text-gray-500">
                            To: <span className="text-gray-300">{draft.profiles?.email}</span> • 
                            For: <span className="text-orange-500">{draft.profiles?.website_url || 'Unknown URL'}</span>
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                        >
                            <Eye size={18} />
                        </button>
                    </div>
                </div>

                {/* Preview Body */}
                {isExpanded && (
                    <div className="mb-6 p-4 bg-white rounded-lg text-black text-sm overflow-auto max-h-96">
                        <div dangerouslySetInnerHTML={{ __html: draft.body_html }} />
                    </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-xs text-gray-600 font-mono">
                        Draft ID: {draft.id.slice(0, 8)}
                    </span>
                    <div className="flex gap-3">
                        <button 
                            onClick={handleDiscard}
                            disabled={sending || discarding}
                            className="px-4 py-2 rounded-lg bg-red-500/10 text-red-500 text-sm font-bold hover:bg-red-500/20 transition-colors"
                        >
                            {discarding ? 'Discarding...' : 'Discard'}
                        </button>
                        <button 
                            onClick={handleSend}
                            disabled={sending}
                            className="px-6 py-2 rounded-lg bg-orange-500 text-black text-sm font-bold hover:bg-orange-400 transition-colors flex items-center gap-2"
                        >
                            {sending ? 'Sending...' : (
                                <>
                                    <Send size={16} /> Send Now
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
