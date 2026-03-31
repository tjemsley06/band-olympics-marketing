import { defineMiddleware } from "astro:middleware";

const SITE_PASSWORD = "B@ndXP2026!";
const COOKIE_NAME = "bxp_site_access";
const COOKIE_VALUE = "authorized";

export const onRequest = defineMiddleware(async ({ request, cookies, url }, next) => {
  // Always allow the contact page (public)
  if (url.pathname === "/contact" || url.pathname === "/contact/") {
    return next();
  }

  // Always allow the password verification endpoint
  if (url.pathname === "/api/verify-password") {
    return next();
  }

  // Always allow the contact form API
  if (url.pathname === "/api/contact") {
    return next();
  }

  // Always allow static assets
  if (
    url.pathname.startsWith("/_astro/") ||
    url.pathname.endsWith(".ico") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".xml") ||
    url.pathname.endsWith(".txt") ||
    url.pathname.endsWith(".webmanifest")
  ) {
    return next();
  }

  // Check for auth cookie
  const accessCookie = cookies.get(COOKIE_NAME);
  if (accessCookie?.value === COOKIE_VALUE) {
    return next();
  }

  // Check if this is a password form submission (POST to any page)
  if (request.method === "POST") {
    const formData = await request.formData();
    const password = formData.get("password")?.toString();

    if (password === SITE_PASSWORD) {
      cookies.set(COOKIE_NAME, COOKIE_VALUE, {
        path: "/",
        httpOnly: true,
        secure: url.protocol === "https:",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
      return new Response(null, {
        status: 302,
        headers: { Location: url.pathname },
      });
    }

    // Wrong password — show form with error
    return new Response(buildPasswordPage(true), {
      status: 401,
      headers: { "Content-Type": "text/html" },
    });
  }

  // No cookie, show password form
  return new Response(buildPasswordPage(false), {
    status: 401,
    headers: { "Content-Type": "text/html" },
  });
});

function buildPasswordPage(showError: boolean): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>BandXP.Live — Password Required</title>
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0a0a0a;
      background-image: radial-gradient(ellipse at top center, #4c1d95 0%, #1a1a2e 40%, #0a0a0a 80%);
      font-family: 'Inter', system-ui, sans-serif;
      color: #ffffff;
      -webkit-font-smoothing: antialiased;
    }
    .container {
      max-width: 400px;
      width: 100%;
      padding: 2rem;
      text-align: center;
    }
    .logo {
      width: 80px;
      height: 80px;
      margin: 0 auto 1.5rem;
      filter: drop-shadow(0 0 24px rgba(124, 58, 237, 0.5));
    }
    .brand {
      font-size: 1.5rem;
      font-weight: 900;
      letter-spacing: -0.02em;
      margin-bottom: 0.5rem;
    }
    .brand-white { color: #ffffff; }
    .brand-pink { color: #ff00ea; }
    .brand-cyan { color: #00e5ff; }
    .subtitle {
      color: #a0a0b0;
      font-size: 0.875rem;
      margin-bottom: 2rem;
    }
    .card {
      background: rgba(26, 26, 46, 0.4);
      border: 1px solid rgba(124, 58, 237, 0.2);
      border-radius: 16px;
      padding: 2rem;
      backdrop-filter: blur(12px);
    }
    label {
      display: block;
      text-align: left;
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: #ffffff;
    }
    input {
      width: 100%;
      padding: 0.875rem 1rem;
      background: rgba(10, 10, 10, 0.6);
      border: 1px solid rgba(124, 58, 237, 0.15);
      border-radius: 12px;
      color: #ffffff;
      font-family: 'Inter', sans-serif;
      font-size: 0.875rem;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    input:focus {
      border-color: rgba(124, 58, 237, 0.5);
      box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
    }
    input::placeholder { color: rgba(160, 160, 176, 0.5); }
    button {
      width: 100%;
      margin-top: 1rem;
      padding: 0.875rem;
      background: #7c3aed;
      color: #ffffff;
      border: none;
      border-radius: 12px;
      font-family: 'Inter', sans-serif;
      font-size: 0.875rem;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.2s, box-shadow 0.2s;
      box-shadow: 0 0 20px rgba(124, 58, 237, 0.3);
    }
    button:hover {
      background: #6d28d9;
      box-shadow: 0 0 30px rgba(124, 58, 237, 0.5);
    }
    .error {
      margin-top: 0.75rem;
      color: #ef4444;
      font-size: 0.8rem;
      font-weight: 500;
    }
  </style>
</head>
<body>
  <div class="container">
    <img src="/bandxp-logo.png" alt="BandXP.Live" class="logo" />
    <div class="brand">
      <span class="brand-white">Band</span><span class="brand-pink">XP</span><span class="brand-white">.</span><span class="brand-cyan">Live</span>
    </div>
    <p class="subtitle">This site is currently in preview. Enter the password to continue.</p>
    <div class="card">
      <form method="POST">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" placeholder="Enter site password" autofocus required />
        <button type="submit">Enter Site</button>
        ${showError ? '<p class="error">Incorrect password. Please try again.</p>' : ""}
      </form>
    </div>
  </div>
</body>
</html>`;
}
