import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://jrweteqpdijsczvitrho.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impyd2V0ZXFwZGlqc2N6dml0cmhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxODgzNDIsImV4cCI6MjA5OTc2NDM0Mn0.8G_PhmbfhnnZoOcrkiZ-kq8kEBCIvZUfALTYzACWLrc"
);
