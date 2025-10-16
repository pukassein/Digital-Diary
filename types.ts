export interface DiaryEntry {
  id: string; // Using UUID from Supabase as the primary key.
  date: string; // 'YYYY-MM-DD'
  // FIX: Allow content to be null to match the likely database schema.
  content: string | null;
  // FIX: Allow ideas to be null to match the likely database schema.
  ideas: string | null;
  image_url: string | null; // Base64 data URL, matching the Supabase column name
  created_at: string;
}
