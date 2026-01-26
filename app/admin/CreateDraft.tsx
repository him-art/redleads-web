'use client';

import { useState } from 'react';
import { Plus, Save, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function CreateDraft({ users }: { users: any[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [userId, setUserId] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('<div style="font-family: sans-serif;">\n  <p>Hi there,</p>\n  <p>I found this Reddit thread that looks perfect for you:</p>\n  <p><a href="...">Link Title</a></p>\n</div>');
    const [saving, setSaving] = useState(false);

    const supabase = createClient();

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId || !subject || !body) return;

        setSaving(true);
        try {
            const { error } = await supabase
                .from('email_drafts')
                .insert({
                    user_id: userId,
                    subject,
                    body_html: body,
                    status: 'draft'
                });

            if (error) throw error;

            setIsOpen(false);
            // Reset form
            setSubject('');
            setUserId('');
            alert('Draft saved successfully! Refresh page to see it.');
            window.location.reload(); // Simple reload to show new draft
        } catch (error: any) {
            alert('Error saving draft: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="w-full py-4 rounded-xl border border-dashed border-white/20 text-gray-400 hover:text-white hover:border-orange-500 hover:bg-orange-500/5 transition-all flex items-center justify-center gap-2 font-bold"
            >
                <Plus size={20} /> Create Manual Draft
            </button>
        );
    }

    return (
        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-orange-500/30 shadow-lg relative">
            <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white"
            >
                <X size={20} />
            </button>

            <h3 className="text-lg font-bold mb-6 text-white">New Manual Draft</h3>

            <form onSubmit={handleSave} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Recipient</label>
                    <select
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-orange-500 outline-none"
                        required
                    >
                        <option value="">Select a user...</option>
                        {users.map((u) => (
                            <option key={u.id} value={u.id}>
                                {u.email} ({u.website_url || 'No URL'})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Subject</label>
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g. 🎯 High intent lead found regarding..."
                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-orange-500 outline-none"
                        required
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email Body (HTML)</label>
                    <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        rows={8}
                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white font-mono text-sm focus:border-orange-500 outline-none"
                        required
                    />
                    <p className="text-[10px] text-gray-500 mt-1">Accepts raw HTML.</p>
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2 bg-orange-500 text-black font-bold rounded-lg hover:bg-orange-400 transition-colors flex items-center gap-2"
                    >
                        {saving ? 'Saving...' : <><Save size={16} /> Save Draft</>}
                    </button>
                </div>
            </form>
        </div>
    );
}
