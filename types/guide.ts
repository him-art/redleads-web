import { Database } from './database.types';

export type GuideNode = Database['public']['Tables']['Guide_nodes']['Row'] & {
  day_number?: number | null;
  estimated_minutes?: number | null;
};
export type UserProgress = Database['public']['Tables']['user_Guide_progress']['Row'];

export interface GuideStep extends GuideNode {
  status: 'upcoming' | 'active' | 'completed' | 'skipped';
}

export type GuidePhase = {
  id: number;
  title: string;
  description: string;
  steps: GuideStep[];
}
