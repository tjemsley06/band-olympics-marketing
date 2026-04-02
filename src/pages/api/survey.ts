import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const supabaseUrl = import.meta.env.SUPABASE_URL;
  const supabaseKey = import.meta.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return new Response(JSON.stringify({ error: "Server configuration error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { error } = await supabase.from("survey_responses").insert({
    role: body.role,
    program_size: body.program_size,
    current_tracking: body.current_tracking,
    pain_points: body.pain_points,
    competition_interest: body.competition_interest,
    hidden_objectives: body.hidden_objectives,
    objective_sheets: body.objective_sheets,
    marching_passoffs: body.marching_passoffs,
    print_export: body.print_export,
    private_lessons: body.private_lessons,
    customization: body.customization,
    pricing_comfort: body.pricing_comfort,
    budget_source: body.budget_source,
    pilot_interest: body.pilot_interest,
    contact_name: body.contact_name,
    contact_email: body.contact_email,
    contact_school: body.contact_school,
    contact_district: body.contact_district,
    open_feedback: body.open_feedback,
  });

  if (error) {
    console.error("Supabase insert error:", error);
    return new Response(JSON.stringify({ error: "Failed to save response" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
