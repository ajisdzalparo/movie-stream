"use server"

import { createClient } from "@supabase/supabase-js"

export async function submitWaitlist(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const role = formData.get("role") as string
  const company = (formData.get("company") as string) || null
  const workflow = (formData.get("workflow") as string) || null
  const biggest_problem = (formData.get("biggest_problem") as string) || null

  // Validate required fields
  if (!name || !email || !role) {
    return { success: false, error: "Name, email, and role are required." }
  }

  // Basic email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Please enter a valid email address." }
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey || supabaseUrl === "https://your-project.supabase.co") {
      // If Supabase is not configured, log and return success for dev
      console.log("[Waitlist] Supabase not configured. Submission data:", {
        name,
        email,
        role,
        company,
        workflow,
        biggest_problem,
      })
      return { success: true }
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { error } = await supabase.from("waitlist").insert({
      name,
      email,
      role,
      company,
      workflow,
      biggest_problem,
    })

    if (error) {
      console.error("[Waitlist] Supabase insert error:", error)
      return { success: false, error: `Supabase Error: ${error.message || error.code}` }
    }

    return { success: true }
  } catch (err: unknown) {
    console.error("[Waitlist] Unexpected error:", err)
    return { success: false, error: `Unexpected Error: ${(err as Error).message || 'Unknown'}` }
  }
}

/*
  SQL to create the waitlist table in Supabase:

  CREATE TABLE waitlist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL,
    company TEXT,
    workflow TEXT,
    biggest_problem TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
  );

  -- Enable Row Level Security
  ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

  -- Allow anonymous inserts (for the landing page form)
  CREATE POLICY "Allow anonymous inserts" ON waitlist
    FOR INSERT TO anon
    WITH CHECK (true);
*/
