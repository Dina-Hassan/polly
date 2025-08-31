// Database types generated for Supabase

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
      profiles: {
        Row: {
          id: string
          username: string | null
          display_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      polls: {
        Row: {
          id: string
          title: string
          description: string | null
          creator_id: string
          is_public: boolean
          allow_multiple_votes: boolean
          created_at: string
          updated_at: string
          expires_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          creator_id: string
          is_public?: boolean
          allow_multiple_votes?: boolean
          created_at?: string
          updated_at?: string
          expires_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          creator_id?: string
          is_public?: boolean
          allow_multiple_votes?: boolean
          created_at?: string
          updated_at?: string
          expires_at?: string | null
        }
      }
      poll_options: {
        Row: {
          id: string
          poll_id: string
          option_text: string
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          poll_id: string
          option_text: string
          position: number
          created_at?: string
        }
        Update: {
          id?: string
          poll_id?: string
          option_text?: string
          position?: number
          created_at?: string
        }
      }
      votes: {
        Row: {
          id: string
          poll_id: string
          option_id: string
          user_id: string | null
          voter_ip: string | null
          created_at: string
        }
        Insert: {
          id?: string
          poll_id: string
          option_id: string
          user_id?: string | null
          voter_ip?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          poll_id?: string
          option_id?: string
          user_id?: string | null
          voter_ip?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_poll_results: {
        Args: {
          poll_id: string
        }
        Returns: {
          option_id: string
          option_text: string
          position: number
          vote_count: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for Supabase tables
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Poll = Database['public']['Tables']['polls']['Row']
export type PollOption = Database['public']['Tables']['poll_options']['Row']
export type Vote = Database['public']['Tables']['votes']['Row']

// Helper types for inserting data
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type PollInsert = Database['public']['Tables']['polls']['Insert']
export type PollOptionInsert = Database['public']['Tables']['poll_options']['Insert']
export type VoteInsert = Database['public']['Tables']['votes']['Insert']

// Helper types for updating data
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']
export type PollUpdate = Database['public']['Tables']['polls']['Update']
export type PollOptionUpdate = Database['public']['Tables']['poll_options']['Update']
export type VoteUpdate = Database['public']['Tables']['votes']['Update']

// Helper type for poll results
export type PollResult = Database['public']['Functions']['get_poll_results']['Returns'][0]