import { Database } from './database.types';

export type RoadmapNode = Database['public']['Tables']['roadmap_nodes']['Row'];
export type UserProgress = Database['public']['Tables']['user_roadmap_progress']['Row'];

export interface RoadmapStep extends RoadmapNode {
  status: 'locked' | 'active' | 'completed' | 'skipped';
}

export type RoadmapPhase = {
  id: number;
  title: string;
  description: string;
  steps: RoadmapStep[];
}
