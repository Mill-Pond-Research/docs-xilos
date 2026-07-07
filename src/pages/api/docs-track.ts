import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Docs tracking proxy for docs.xilos.ai.
 * 
 * POST /api/docs-track
 * Body: { page_path, page_title, referrer, session_id }
 * 
 * Reads the httpOnly xilos_docs_token cookie to extract user info,
 * then forwards the tracking event to the Xilos API. This keeps the
 * JWT off the client while still associating page views with users.
 */

const XILOS_API_URL = process.env.XILOS_API_URL || "https://api.xilos.ai";

interface TrackRequest {
  page_path: string;
  page_title?: string;
  referrer?: string;
  session_id?: string;
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

  // Read user info from the non-httpOnly cookie
  const userCookie = req.cookies.xilos_docs_user;
  let user_id: string | undefined;
  let user_email: string | undefined;

  if (userCookie) {
    try {
      const decoded = JSON.parse(decodeURIComponent(userCookie));
      user_id = decoded.id;
      user_email = decoded.email;
    } catch {
      // Cookie is malformed — track as anonymous
    }
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
