'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function ConfigToggle({ settingKey, initialValue }: { settingKey: string; initialValue: boolean }) {
    const [isEnabled, setIsEnabled] = useState(initialValue);
    const [isLoading, setIsLoading] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    const handleToggle = async () => {
        setIsLoading(true);
        const newValue = !isEnabled;
        
        const { error } = await supabase
            .from('system_settings')
            .upsert({ key: settingKey, value: newValue });

        if (!error) {
            setIsEnabled(newValue);
            router.refresh();
        } else {
            console.error('Failed to update setting:', error);
        }
        setIsLoading(false);
    };

    return (
        <button
            onClick={handleToggle}
            disabled={isLoading}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                isEnabled ? 'bg-orange-500' : 'bg-gray-700'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
        </button>
    );
}
