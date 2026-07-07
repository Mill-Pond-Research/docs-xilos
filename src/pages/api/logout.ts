import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Logout endpoint for docs.xilos.ai.
 * Clears both auth cookies and redirects to /login.
 */

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Set-Cookie", [
    "xilos_docs_token=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0",
    "xilos_docs_user=; Path=/; Secure; SameSite=Lax; Max-Age=0",
  ]);
  res.status(200).json({ success: true });
}
