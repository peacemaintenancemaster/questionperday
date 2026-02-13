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
      users: {
        Row: {
          id: number
          kakaoId: number
          nickname: string | null
          email: string | null
          isDel: number
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: number
          kakaoId: number
          nickname?: string | null
          email?: string | null
          isDel?: number
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: number
          kakaoId?: number
          nickname?: string | null
          email?: string | null
          isDel?: number
          createdAt?: string
          updatedAt?: string
        }
      }
      question: {
        Row: {
          id: number
          title: string
          article: string | null
          dateAt: string | null
          isDel: number
        }
        Insert: {
          id?: number
          title: string
          article?: string | null
          dateAt?: string | null
          isDel?: number
        }
        Update: {
          id?: number
          title?: string
          article?: string | null
          dateAt?: string | null
          isDel?: number
        }
      }
      answer: {
        Row: {
          id: number
          userId: number | null
          questionId: number | null
          text: string | null
          isShared: number
          isDel: number
          createdAt: string
        }
        Insert: {
          id?: number
          userId?: number | null
          questionId?: number | null
          text?: string | null
          isShared?: number
          isDel?: number
          createdAt?: string
        }
        Update: {
          id?: number
          userId?: number | null
          questionId?: number | null
          text?: string | null
          isShared?: number
          isDel?: number
          createdAt?: string
        }
      }
      memo: {
        Row: {
          id: number
          userId: number | null
          questionId: number | null
          text: string | null
          isDel: number
          createdAt: string
        }
        Insert: {
          id?: number
          userId?: number | null
          questionId?: number | null
          text?: string | null
          isDel?: number
          createdAt?: string
        }
        Update: {
          id?: number
          userId?: number | null
          questionId?: number | null
          text?: string | null
          isDel?: number
          createdAt?: string
        }
      }
    }
  }
}