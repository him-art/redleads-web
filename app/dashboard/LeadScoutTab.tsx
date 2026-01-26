import { Search } from 'lucide-react';
import LeadSearch from '@/components/LeadSearch';

interface LeadScoutTabProps {
    user: any;
    profile: any;
}

export default function LeadScoutTab({ user, profile }: LeadScoutTabProps) {
    return (
        <section className="space-y-6">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-white/5 text-gray-400">
                        <Search size={22} />
                    </div>
                    <h2 className="text-3xl font-black tracking-tight text-gray-200">Deep Scout</h2>
                </div>
                <p className="text-gray-500">Manual archive search. Deep-scan Reddit history for specific keywords or URLs.</p>
            </div>

            <div className="bg-[#1a1a1a] rounded-[2.5rem] p-4 lg:p-8 border border-white/5 transition-all focus-within:border-orange-500/20">
                <LeadSearch 
                    user={user} 
                    isDashboardView={true} 
                    onShowModal={() => {
                        window.location.hash = '#billing'; 
                    }}
                />
            </div>
        </section>
    );
}
