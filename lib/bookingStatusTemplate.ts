"use server";
import nodemailer from "nodemailer";
export async function bookingStatusEmailTemplate(
  to: string,
  userName: string,
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW",
  bookingDate: string,
  bookingTime: string
) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const statusMessages: Record<
    "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW",
    { title: string; message: string }
  > = {
    PENDING: {
      title: "Votre réservation est en attente",
      message:
        "Nous avons bien reçu votre demande. Elle est en cours de traitement. Vous recevrez une confirmation bientôt.",
    },
    CONFIRMED: {
      title: "Votre réservation est confirmée 🎉",
      message:
        "Bonne nouvelle ! Votre réservation a été confirmée. Nous avons hâte de vous accueillir.",
    },
    CANCELLED: {
      title: "Votre réservation a été annulée",
      message:
        "Votre réservation a été annulée selon votre demande ou par l'administration.",
    },
    COMPLETED: {
      title: "Votre séance est terminée ✔",
      message:
        "Merci d'avoir assisté à votre séance. Nous espérons que vous avez apprécié votre expérience.",
    },
    NO_SHOW: {
      title: "Séance manquée",
      message:
        "Il semble que vous ne soyez pas venu à votre séance. Vous pouvez reprogrammer selon votre disponibilité.",
    },
  };

  const { title, message } = statusMessages[status];

  const subject = `Mise à jour de votre réservation — ${title}`;

  const html = `
  <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
    <h2 style="color:#4A4A4A;">${title}</h2>

    <p>Bonjour <strong>${userName}</strong>,</p>
    <p>${message}</p>

    <p>
      <strong>Date :</strong> ${bookingDate}<br/>
      <strong>Heure :</strong> ${bookingTime}
    </p>

    <p style="margin-top:20px;">Merci pour votre confiance.</p>
    <p>Cordialement,<br/>Votre équipe</p>
  </div>
  `;

  const text = `
${title}

Bonjour ${userName},

${message}

Date : ${bookingDate}
Heure : ${bookingTime}

Merci pour votre confiance.

Cordialement
  `;
  try {
    await transporter.sendMail({
      from: `"Your App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    return { success: true };
  } catch (err) {
    console.error("Email error:", err);
    return { success: false, error: "EMAIL_SEND_FAILED" };
  }
}
