export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      monitored_leads: {
        Row: {
          archived_at: string | null
          created_at: string
          id: string
          is_saved: boolean
          keywords_matched: string[] | null
          match_category: string
          match_explanation: string | null
          match_score: number
          status: string
          subreddit: string
          title: string
          updated_at: string
          url: string
          user_id: string
          video_analysis: Json | null
        }
        Insert: {
          archived_at?: string | null
          created_at?: string
          id?: string
          is_saved?: boolean
          keywords_matched?: string[] | null
          match_category?: string
          match_explanation?: string | null
          match_score?: number
          status?: string
          subreddit: string
          title: string
          updated_at?: string
          url: string
          user_id?: string
          video_analysis?: Json | null
        }
        Update: {
          archived_at?: string | null
          created_at?: string
          id?: string
          is_saved?: boolean
          keywords_matched?: string[] | null
          match_category?: string
          match_explanation?: string | null
          match_score?: number
          status?: string
          subreddit?: string
          title?: string
          updated_at?: string
          url?: string
          user_id?: string
          video_analysis?: Json | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          beta_joined_at: string | null
          beta_survey_responses: Json | null
          created_at: string | null
          daily_scan_count: number | null
          description: string | null
          dodo_customer_id: string | null
          dodo_subscription_id: string | null
          email: string | null
          id: string
          is_beta_user: boolean | null
          keyword_limit: number | null
          keywords: string[] | null
          last_scan_at: string | null
          monthly_scan_limit: number | null
          onboarding_completed: boolean | null
          scan_allowance: number | null
          scan_count: number | null
          subscription_started_at: string | null
          subscription_tier: string | null
          trial_ends_at: string | null
          website_url: string | null
        }
        Insert: {
          beta_joined_at?: string | null
          beta_survey_responses?: Json | null
          created_at?: string | null
          daily_scan_count?: number | null
          description?: string | null
          dodo_customer_id?: string | null
          dodo_subscription_id?: string | null
          email?: string | null
          id: string
          is_beta_user?: boolean | null
          keyword_limit?: number | null
          keywords?: string[] | null
          last_scan_at?: string | null
          monthly_scan_limit?: number | null
          onboarding_completed?: boolean | null
          scan_allowance?: number | null
          scan_count?: number | null
          subscription_started_at?: string | null
          subscription_tier?: string | null
          trial_ends_at?: string | null
          website_url?: string | null
        }
        Update: {
          beta_joined_at?: string | null
          beta_survey_responses?: Json | null
          created_at?: string | null
          daily_scan_count?: number | null
          description?: string | null
          dodo_customer_id?: string | null
          dodo_subscription_id?: string | null
          email?: string | null
          id?: string
          is_beta_user?: boolean | null
          keyword_limit?: number | null
          keywords?: string[] | null
          last_scan_at?: string | null
          monthly_scan_limit?: number | null
          onboarding_completed?: boolean | null
          scan_allowance?: number | null
          scan_count?: number | null
          subscription_started_at?: string | null
          subscription_tier?: string | null
          trial_ends_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      Guide_nodes: {
        Row: {
          action_label: string | null
          action_link: string | null
          content: string | null
          created_at: string
          description: string
          id: string
          order_index: number
          phase: number
          title: string
        }
        Insert: {
          action_label?: string | null
          action_link?: string | null
          content?: string | null
          created_at?: string
          description: string
          id?: string
          order_index: number
          phase: number
          title: string
        }
        Update: {
          action_label?: string | null
          action_link?: string | null
          content?: string | null
          created_at?: string
          description?: string
          id?: string
          order_index?: number
          phase?: number
          title?: string
        }
        Relationships: []
      }
      user_Guide_progress: {
        Row: {
          completed_at: string
          node_id: string
          status: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          node_id: string
          status: string
          user_id: string
        }
        Update: {
          completed_at?: string
          node_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_Guide_progress_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "Guide_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      user_access_status: {
        Row: {
          beta_joined_at: string | null
          beta_survey_responses: Json | null
          created_at: string | null
          daily_scan_count: number | null
          description: string | null
          dodo_customer_id: string | null
          dodo_subscription_id: string | null
          effective_keyword_limit: number | null
          effective_tier: string | null
          email: string | null
          id: string | null
          is_admin: boolean | null
          is_beta_user: boolean | null
          keyword_limit: number | null
          keywords: string[] | null
          last_scan_at: string | null
          monthly_scan_limit: number | null
          scan_allowance: number | null
          scan_count: number | null
          subscription_started_at: string | null
          subscription_tier: string | null
          trial_ends_at: string | null
        }
        Relationships: []
      }
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
  ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never
