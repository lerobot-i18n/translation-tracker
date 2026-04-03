import { corsHeaders } from "@supabase/supabase-js/cors";

const GITHUB_API = "https://api.github.com";
const GITHUB_RAW = "https://raw.githubusercontent.com";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const endpoint = url.searchParams.get("endpoint");
    const raw = url.searchParams.get("raw"); // for raw.githubusercontent.com

    if (!endpoint) {
      return new Response(JSON.stringify({ error: "Missing endpoint parameter" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = Deno.env.get("VITE_GITHUB_TOKEN");
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
    };
    if (token && token !== "your_token_here") {
      headers.Authorization = `token ${token}`;
    }

    const baseUrl = raw === "true" ? GITHUB_RAW : GITHUB_API;
    const res = await fetch(`${baseUrl}${endpoint}`, { headers });

    const body = await res.text();
    return new Response(body, {
      status: res.status,
      headers: {
        ...corsHeaders,
        "Content-Type": res.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
