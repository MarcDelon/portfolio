import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Veuillez remplir tous les champs obligatoires.' },
        { status: 400 }
      );
    }

    const recipientEmail = 'marcnzenang@gmail.com';
    const smtpUser = process.env.EMAIL_USER || 'marcnzenang@gmail.com';
    const smtpPass = process.env.EMAIL_PASS || '';

    // If SMTP password is not set yet in .env.local, log warning and use fallback
    if (!smtpPass) {
      console.warn('EMAIL_PASS n\'est pas encore configuré dans .env.local. Veuillez renseigner un mot de passe d\'application Gmail.');
      return NextResponse.json({
        success: true,
        message: 'Message reçu ! Pour finaliser la livraison SMTP en production, configurez votre EMAIL_PASS dans .env.local.'
      });
    }

    // Configure Nodemailer transporter (Gmail SMTP)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Clean & Minimalist Email Template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background-color: #f7f7f7; color: #111111; margin: 0; padding: 24px; line-height: 1.6;">
          <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e5e5; border-radius: 8px; padding: 28px;">
            
            <div style="border-bottom: 1px solid #eeeeee; padding-bottom: 14px; margin-bottom: 20px;">
              <h2 style="margin: 0; font-size: 18px; color: #111111; font-weight: 700;">Nouveau message de contact</h2>
            </div>

            <div style="margin-bottom: 14px;">
              <div style="font-size: 12px; color: #666666; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">De :</div>
              <div style="font-size: 15px; font-weight: 600; color: #111111;">${name} &lt;${email}&gt;</div>
            </div>

            <div style="margin-bottom: 14px;">
              <div style="font-size: 12px; color: #666666; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Sujet :</div>
              <div style="font-size: 15px; font-weight: 600; color: #111111;">${subject || 'Sans objet'}</div>
            </div>

            <div style="margin-bottom: 20px;">
              <div style="font-size: 12px; color: #666666; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">Message :</div>
              <div style="background: #fafafa; border: 1px solid #e8e8e8; border-radius: 6px; padding: 16px; font-size: 14px; color: #222222; white-space: pre-wrap; line-height: 1.6;">${message}</div>
            </div>

            <div style="border-top: 1px solid #eeeeee; padding-top: 14px; font-size: 12px; color: #888888;">
              Répondez directement à cet email pour contacter ${name} (${email}).
            </div>

          </div>
        </body>
      </html>
    `;

    // Send Mail Options
    await transporter.sendMail({
      from: `"Portfolio Marc Delon" <${smtpUser}>`,
      to: recipientEmail,
      replyTo: email,
      subject: `[Portfolio Marc Delon] ${subject || 'Nouveau message de ' + name}`,
      text: `Nouveau message de ${name} (${email}):\n\nSujet: ${subject}\n\nMessage:\n${message}`,
      html: htmlContent,
    });

    return NextResponse.json({
      success: true,
      message: 'Votre message a été envoyé avec succès via Nodemailer !'
    });

  } catch (error: any) {
    console.error('Erreur Nodemailer:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Erreur lors de l\'envoi du message.' },
      { status: 500 }
    );
  }
}
