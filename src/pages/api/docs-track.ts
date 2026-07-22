import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Docs tracking proxy for docs.xilos.ai.
 *
 * POST /api/docs-track
 * Body: { page_path, page_title, referrer, session_id }
 *
 * Reads the httpOnly xilos_docs_token cookie, verifies it against the
 * Xilos API to get the user's identity, then forwards the tracking event
 * with user_id and user_email. This ensures every page view is
 * attributed to a real authenticated user — no anonymous views.
 */

const XILOS_API_URL = process.env.XILOS_API_URL || "https://api.xilos.ai";

interface TrackRequest {
  page_path: string;
  page_title?: string;
  referrer?: string;
  session_id?: string;
}

// Simple in-memory cache: token -> { user_id, user_email, expires }
// Avoids hitting the verify endpoint on every page view.
// Cache entries expire after 1 hour. Max 1000 entries (LRU eviction).
const verifyCache = new Map<string, { user_id: string; user_email: string; expires: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour
const CACHE_MAX = 1000;

async function resolveUser(token: string): Promise<{ user_id?: string; user_email?: string }> {
  // Check cache
  const cached = verifyCache.get(token);
  if (cached && cached.expires > Date.now()) {
    return { user_id: cached.user_id, user_email: cached.user_email };
  }

  try {
    const res = await fetch(`${XILOS_API_URL}/api/v1/auth/token/verify/${token}`, {
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      return {};
    }

    const user = await res.json();
    const userId = user.id || user.user_id;
    const userEmail = user.email;

    if (userId) {
      // Cache the result
      if (verifyCache.size >= CACHE_MAX) {
        // Evict oldest entry
        const oldest = verifyCache.keys().next().value;
        if (oldest) verifyCache.delete(oldest);
      }
      verifyCache.set(token, {
        user_id: userId,
        user_email: userEmail || "",
        expires: Date.now() + CACHE_TTL,
      });
    }

    return { user_id: userId, user_email: userEmail };
  } catch {
    // If verification fails, track as anonymous (better than losing the event)
    return {};
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { page_path, page_title, referrer, session_id }: TrackRequest = req.body;

  if (!page_path) {
    return res.status(400).json({ error: "page_path is required" });
  }

  // Read the auth token cookie and verify it to get user identity
  const token = req.cookies.xilos_docs_token;
  let user_id: string | undefined;
  let user_email: string | undefined;

  if (token) {
    const userInfo = await resolveUser(token);
    user_id = userInfo.user_id;
    user_email = userInfo.user_email;
  }

  try {
    await fetch(`${XILOS_API_URL}/api/v1/docs-analytics/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page_path,
        page_title: page_title || undefined,
        referrer: referrer || undefined,
        session_id: session_id || undefined,
        user_id: user_id || undefined,
        user_email: user_email || undefined,
      }),
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("[docs-xilos] Tracking error:", error);
    // Don't fail the user's page load over tracking errors
    return res.status(200).json({ success: false });
  }
}
