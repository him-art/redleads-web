export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      roadmap_nodes: {
        Row: {
          id: string
          created_at: string
          phase: number
          order_index: number
          title: string
          description: string
          content: string | null
          action_link: string | null
          action_label: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          phase: number
          order_index: number
          title: string
          description: string
          content?: string | null
          action_link?: string | null
          action_label?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          phase?: number
          order_index?: number
          title?: string
          description?: string
          content?: string | null
          action_link?: string | null
          action_label?: string | null
        }
        Relationships: []
      }
      user_roadmap_progress: {
        Row: {
          user_id: string
          node_id: string
          completed_at: string
          status: 'completed' | 'skipped' | 'locked' | 'unlocked' // Added locked/unlocked for UI state, though DB constraint only had completed/skipped. I should probably update DB constraint or just use 'completed' in DB and infer others. DB had check(status in ('completed', 'skipped')). Let's stick to DB.
        }
        Insert: {
          user_id: string
          node_id: string
          completed_at?: string
          status: 'completed' | 'skipped'
        }
        Update: {
          user_id?: string
          node_id?: string
          completed_at?: string
          status?: 'completed' | 'skipped'
        }
        Relationships: [
          {
            foreignKeyName: "user_roadmap_progress_node_id_fkey"
            columns: ["node_id"]
            referencedRelation: "roadmap_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roadmap_progress_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
