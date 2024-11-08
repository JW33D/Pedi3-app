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
      categoria: {
        Row: {
          idCategoria: number
          Nombre: string
        }
        Insert: {
          idCategoria?: number
          Nombre: string
        }
        Update: {
          idCategoria?: number
          Nombre?: string
        }
        Relationships: []
      }
      galeria: {
        Row: {
          idGaleria: number
          idInventario: number
          urlFoto: string | null
        }
        Insert: {
          idGaleria?: number
          idInventario: number
          urlFoto?: string | null
        }
        Update: {
          idGaleria?: number
          idInventario?: number
          urlFoto?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "galeria_idInventario_fkey"
            columns: ["idInventario"]
            isOneToOne: false
            referencedRelation: "inventario"
            referencedColumns: ["idInventario"]
          },
        ]
      }
      inventario: {
        Row: {
          cantidad: number | null
          estado: number | null
          idInventario: number
          idSubcategoria: number
          nombreProducto: string | null
          precio: number | null
          urlFoto: string | null
        }
        Insert: {
          cantidad?: number | null
          estado?: number | null
          idInventario?: number
          idSubcategoria: number
          nombreProducto?: string | null
          precio?: number | null
          urlFoto?: string | null
        }
        Update: {
          cantidad?: number | null
          estado?: number | null
          idInventario?: number
          idSubcategoria?: number
          nombreProducto?: string | null
          precio?: number | null
          urlFoto?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventario_idSubcategoria_fkey"
            columns: ["idSubcategoria"]
            isOneToOne: false
            referencedRelation: "subcategoria"
            referencedColumns: ["idSubcategoria"]
          },
        ]
      }
      mesas: {
        Row: {
          icono: string | null
          idMesa: number
          mesas: string
        }
        Insert: {
          icono?: string | null
          idMesa?: number
          mesas: string
        }
        Update: {
          icono?: string | null
          idMesa?: number
          mesas?: string
        }
        Relationships: []
      }
      pedidos: {
        Row: {
          idMesa: number | null
          idPedidos: number
          pedido: Json
        }
        Insert: {
          idMesa?: number | null
          idPedidos?: number
          pedido: Json
        }
        Update: {
          idMesa?: number | null
          idPedidos?: number
          pedido?: Json
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_idMesa_fkey"
            columns: ["idMesa"]
            isOneToOne: false
            referencedRelation: "mesas"
            referencedColumns: ["idMesa"]
          },
        ]
      }
      pedidosMesas: {
        Row: {
          idMesa: number
          idPedidosM: number
          pedidoM: Json | null
        }
        Insert: {
          idMesa: number
          idPedidosM?: number
          pedidoM?: Json | null
        }
        Update: {
          idMesa?: number
          idPedidosM?: number
          pedidoM?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "pedidosMesas_idMesa_fkey"
            columns: ["idMesa"]
            isOneToOne: false
            referencedRelation: "mesas"
            referencedColumns: ["idMesa"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      subcategoria: {
        Row: {
          estado: number | null
          idCategoria: number
          idSubcategoria: number
          Nombre: string | null
        }
        Insert: {
          estado?: number | null
          idCategoria: number
          idSubcategoria?: number
          Nombre?: string | null
        }
        Update: {
          estado?: number | null
          idCategoria?: number
          idSubcategoria?: number
          Nombre?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subcategoria_idCategoria_fkey"
            columns: ["idCategoria"]
            isOneToOne: false
            referencedRelation: "categoria"
            referencedColumns: ["idCategoria"]
          },
        ]
      }
      VariacionPrecio: {
        Row: {
          idInventario: number
          idVariacion: number
          nombre: string | null
          precio: number | null
        }
        Insert: {
          idInventario: number
          idVariacion?: number
          nombre?: string | null
          precio?: number | null
        }
        Update: {
          idInventario?: number
          idVariacion?: number
          nombre?: string | null
          precio?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "VariacionPrecio_idInventario_fkey"
            columns: ["idInventario"]
            isOneToOne: false
            referencedRelation: "inventario"
            referencedColumns: ["idInventario"]
          },
        ]
      }
      ventas: {
        Row: {
          idMesa: number | null
          idVentas: number
          tiempo: string | null
          Venta: number
        }
        Insert: {
          idMesa?: number | null
          idVentas?: number
          tiempo?: string | null
          Venta: number
        }
        Update: {
          idMesa?: number | null
          idVentas?: number
          tiempo?: string | null
          Venta?: number
        }
        Relationships: [
          {
            foreignKeyName: "ventas_idMesa_fkey"
            columns: ["idMesa"]
            isOneToOne: false
            referencedRelation: "mesas"
            referencedColumns: ["idMesa"]
          },
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
