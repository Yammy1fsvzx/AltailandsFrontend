// Type for Working Hours entry
export interface WorkingHour {
  day_of_week: number; // 0 = Monday, 6 = Sunday ? Check backend convention
  start_time: string | null;
  end_time: string | null;
  is_active: boolean;
}

// Main Contact Information type
export interface ContactInfo {
  id: number;
  phone: string;
  whatsapp?: string | null;
  email?: string | null;
  office_address?: string | null;
  created_at: string;
  updated_at: string;
  working_hours?: WorkingHour[];
} 