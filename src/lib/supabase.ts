import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://hqeodauepgtvwuvzgfpq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxZW9kYXVlcGd0dnd1dnpnZnBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTAxMjQ3OTQsImV4cCI6MjAyNTcwMDc5NH0.M",
);
