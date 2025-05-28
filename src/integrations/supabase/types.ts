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
      cost_settings: {
        Row: {
          advertising_cost: number | null
          checkout_fee_percentage: number | null
          created_at: string
          credit_card_fee_10x: number | null
          credit_card_fee_11x: number | null
          credit_card_fee_12x: number | null
          credit_card_fee_1x: number | null
          credit_card_fee_2x: number | null
          credit_card_fee_3x: number | null
          credit_card_fee_4x: number | null
          credit_card_fee_5x: number | null
          credit_card_fee_6x: number | null
          credit_card_fee_7x: number | null
          credit_card_fee_8x: number | null
          credit_card_fee_9x: number | null
          id: string
          pix_gateway_fee_percentage: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          advertising_cost?: number | null
          checkout_fee_percentage?: number | null
          created_at?: string
          credit_card_fee_10x?: number | null
          credit_card_fee_11x?: number | null
          credit_card_fee_12x?: number | null
          credit_card_fee_1x?: number | null
          credit_card_fee_2x?: number | null
          credit_card_fee_3x?: number | null
          credit_card_fee_4x?: number | null
          credit_card_fee_5x?: number | null
          credit_card_fee_6x?: number | null
          credit_card_fee_7x?: number | null
          credit_card_fee_8x?: number | null
          credit_card_fee_9x?: number | null
          id?: string
          pix_gateway_fee_percentage?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          advertising_cost?: number | null
          checkout_fee_percentage?: number | null
          created_at?: string
          credit_card_fee_10x?: number | null
          credit_card_fee_11x?: number | null
          credit_card_fee_12x?: number | null
          credit_card_fee_1x?: number | null
          credit_card_fee_2x?: number | null
          credit_card_fee_3x?: number | null
          credit_card_fee_4x?: number | null
          credit_card_fee_5x?: number | null
          credit_card_fee_6x?: number | null
          credit_card_fee_7x?: number | null
          credit_card_fee_8x?: number | null
          credit_card_fee_9x?: number | null
          id?: string
          pix_gateway_fee_percentage?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          address_city: string | null
          address_complement: string | null
          address_country: string | null
          address_neighborhood: string | null
          address_number: string | null
          address_state: string | null
          address_street: string | null
          address_zip_code: string | null
          amount: number
          barcode: string | null
          billing_address_city: string | null
          billing_address_complement: string | null
          billing_address_country: string | null
          billing_address_neighborhood: string | null
          billing_address_number: string | null
          billing_address_state: string | null
          billing_address_street: string | null
          billing_address_zip_code: string | null
          cancelled_at: string | null
          cancelled_reason: string | null
          created_at: string
          customer_birth_date: string | null
          customer_document: string | null
          customer_email: string
          customer_gender: string | null
          customer_name: string
          customer_phone: string | null
          discount_amount: number | null
          due_date: string | null
          expired_at: string | null
          external_id: string
          id: string
          installments: number | null
          items: Json | null
          metadata: Json | null
          notes: string | null
          paid_amount: number | null
          paid_at: string | null
          payment_gateway: string | null
          payment_link: string | null
          payment_method: string
          pix_key: string | null
          qr_code: string | null
          refund_amount: number | null
          refund_reason: string | null
          secure_url: string | null
          shipping_amount: number | null
          status: string
          tags: Json | null
          tax_amount: number | null
          transaction_id: string | null
          updated_at: string
          webhook_event: string | null
          webhook_source: string | null
        }
        Insert: {
          address_city?: string | null
          address_complement?: string | null
          address_country?: string | null
          address_neighborhood?: string | null
          address_number?: string | null
          address_state?: string | null
          address_street?: string | null
          address_zip_code?: string | null
          amount: number
          barcode?: string | null
          billing_address_city?: string | null
          billing_address_complement?: string | null
          billing_address_country?: string | null
          billing_address_neighborhood?: string | null
          billing_address_number?: string | null
          billing_address_state?: string | null
          billing_address_street?: string | null
          billing_address_zip_code?: string | null
          cancelled_at?: string | null
          cancelled_reason?: string | null
          created_at?: string
          customer_birth_date?: string | null
          customer_document?: string | null
          customer_email: string
          customer_gender?: string | null
          customer_name: string
          customer_phone?: string | null
          discount_amount?: number | null
          due_date?: string | null
          expired_at?: string | null
          external_id: string
          id?: string
          installments?: number | null
          items?: Json | null
          metadata?: Json | null
          notes?: string | null
          paid_amount?: number | null
          paid_at?: string | null
          payment_gateway?: string | null
          payment_link?: string | null
          payment_method: string
          pix_key?: string | null
          qr_code?: string | null
          refund_amount?: number | null
          refund_reason?: string | null
          secure_url?: string | null
          shipping_amount?: number | null
          status: string
          tags?: Json | null
          tax_amount?: number | null
          transaction_id?: string | null
          updated_at?: string
          webhook_event?: string | null
          webhook_source?: string | null
        }
        Update: {
          address_city?: string | null
          address_complement?: string | null
          address_country?: string | null
          address_neighborhood?: string | null
          address_number?: string | null
          address_state?: string | null
          address_street?: string | null
          address_zip_code?: string | null
          amount?: number
          barcode?: string | null
          billing_address_city?: string | null
          billing_address_complement?: string | null
          billing_address_country?: string | null
          billing_address_neighborhood?: string | null
          billing_address_number?: string | null
          billing_address_state?: string | null
          billing_address_street?: string | null
          billing_address_zip_code?: string | null
          cancelled_at?: string | null
          cancelled_reason?: string | null
          created_at?: string
          customer_birth_date?: string | null
          customer_document?: string | null
          customer_email?: string
          customer_gender?: string | null
          customer_name?: string
          customer_phone?: string | null
          discount_amount?: number | null
          due_date?: string | null
          expired_at?: string | null
          external_id?: string
          id?: string
          installments?: number | null
          items?: Json | null
          metadata?: Json | null
          notes?: string | null
          paid_amount?: number | null
          paid_at?: string | null
          payment_gateway?: string | null
          payment_link?: string | null
          payment_method?: string
          pix_key?: string | null
          qr_code?: string | null
          refund_amount?: number | null
          refund_reason?: string | null
          secure_url?: string | null
          shipping_amount?: number | null
          status?: string
          tags?: Json | null
          tax_amount?: number | null
          transaction_id?: string | null
          updated_at?: string
          webhook_event?: string | null
          webhook_source?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
