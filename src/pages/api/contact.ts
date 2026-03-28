import type { APIRoute } from "astro";
import { Resend } from "resend";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const resendKey = import.meta.env.RESEND_API_KEY;
  const toEmail = import.meta.env.CONTACT_FORM_TO_EMAIL;

  if (!resendKey || !toEmail) {
    return new Response(JSON.stringify({ error: "Server configuration error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: { name: string; school: string; email: string; students: string; message: string };

  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { name, school, email, students, message } = body;

  if (!name || !school || !email || !students || !message) {
    return new Response(JSON.stringify({ error: "All fields are required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const resend = new Resend(resendKey);

  // Send notification to admin
  try {
    await resend.emails.send({
      from: "Band Olympics <noreply@bandolympics.live>",
      to: toEmail,
      subject: `New Contact Form: ${school}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; border: 1px solid #27272a; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #7c3aed, #4c1d95); padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 20px;">New Contact Form Submission</h1>
          </div>
          <div style="padding: 24px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="color: #a0a0b0; padding: 8px 0; font-size: 14px;">Name</td><td style="color: #ffffff; padding: 8px 0; font-size: 14px;">${name}</td></tr>
              <tr><td style="color: #a0a0b0; padding: 8px 0; font-size: 14px;">School</td><td style="color: #ffffff; padding: 8px 0; font-size: 14px;">${school}</td></tr>
              <tr><td style="color: #a0a0b0; padding: 8px 0; font-size: 14px;">Email</td><td style="color: #ffffff; padding: 8px 0; font-size: 14px;"><a href="mailto:${email}" style="color: #7c3aed;">${email}</a></td></tr>
              <tr><td style="color: #a0a0b0; padding: 8px 0; font-size: 14px;">Students</td><td style="color: #ffffff; padding: 8px 0; font-size: 14px;">${students}</td></tr>
            </table>
            <div style="margin-top: 16px; padding: 16px; background: #1a1a2e; border-radius: 8px; border: 1px solid #27272a;">
              <p style="color: #a0a0b0; font-size: 12px; margin: 0 0 8px 0;">Message:</p>
              <p style="color: #ffffff; font-size: 14px; margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error("Failed to send admin notification:", err);
    return new Response(JSON.stringify({ error: "Failed to send message. Please try again." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Send confirmation to submitter
  try {
    await resend.emails.send({
      from: "Band Olympics <noreply@bandolympics.live>",
      to: email,
      subject: "We received your message — Band Olympics",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; border: 1px solid #27272a; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #7c3aed, #4c1d95); padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 20px;">Thanks for reaching out!</h1>
          </div>
          <div style="padding: 24px;">
            <p style="color: #ffffff; font-size: 14px; line-height: 1.6;">Hi ${name},</p>
            <p style="color: #a0a0b0; font-size: 14px; line-height: 1.6;">We received your message about ${school}. A member of our team will get back to you shortly.</p>
            <p style="color: #a0a0b0; font-size: 14px; line-height: 1.6;">In the meantime, you can learn more at <a href="https://bandolympicslive.com" style="color: #7c3aed;">bandolympicslive.com</a>.</p>
            <p style="color: #a0a0b0; font-size: 14px; line-height: 1.6; margin-top: 24px;">— The Band Olympics Team</p>
          </div>
          <div style="padding: 16px 24px; border-top: 1px solid #27272a; text-align: center;">
            <p style="color: #666; font-size: 12px; margin: 0; font-style: italic;">Own Your Practice. Earn Your Medal.</p>
          </div>
        </div>
      `,
    });
  } catch (err) {
    // Non-fatal — admin already received the submission
    console.error("Failed to send confirmation email:", err);
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
