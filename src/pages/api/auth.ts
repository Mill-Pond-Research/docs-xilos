import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Login proxy for docs.xilos.ai.
 * 
 * POST /api/auth
 * Body: { email, password }
 * 
 * Calls the Xilos API (/api/v1/auth/login) to authenticate.
 * On success, sets two cookies:
 *   - xilos_docs_token (httpOnly) — JWT for auth verification
 *   - xilos_docs_user (readable by JS) — { id, email, name } for analytics tracking
 * 
 * Returns { success: true, user: {...} } or { success: false, error: "..." }
 */

const XILOS_API_URL = process.env.XILOS_API_URL || "https://api.xilos.ai";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days (matches JWT expiry)

interface XilosLoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    name: string;
    email: string | null;
    role: string;
    organization_id: string | null;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const response = await fetch(`${XILOS_API_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(401).json({
        error: errorData.detail || "Invalid email or password",
      });
    }

    const data: XilosLoginResponse = await response.json();

    // Set httpOnly cookie with JWT (secure, not accessible by JS)
    res.setHeader("Set-Cookie", [
      `xilos_docs_token=${data.access_token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}`,
      // Non-httpOnly cookie with user info for analytics tracking
      `xilos_docs_user=${encodeURIComponent(JSON.stringify({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
      }))}; Path=/; Secure; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}`,
    ]);

    return res.status(200).json({
      success: true,
      user: data.user,
    });
  } catch (error) {
    console.error("[docs-xilos] Login error:", error);
    return res.status(500).json({ error: "Authentication failed" });
  }
}
