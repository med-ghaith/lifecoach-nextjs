import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, message, phone } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const whatsappMessage = `📩 Nouveau message depuis le site :
    
👤 Nom : ${name}
📧 Email : ${email}
📱 Téléphone : ${phone}
💬 Message :
${message}
    `;

    const response = await fetch(
      `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: process.env.WHATSAPP_RECEIVER, // number to receive messages
          type: "text",
          text: {
            body: whatsappMessage,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("WhatsApp API error:", data);
      return NextResponse.json(
        { error: "WhatsApp API error", details: data },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Server error", details: error },
      { status: 500 }
    );
  }
}
