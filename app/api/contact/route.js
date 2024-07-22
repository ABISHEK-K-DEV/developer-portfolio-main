import axios from 'axios';
import { NextResponse } from "next/server";

export async function POST(request) {
  const payload = await request.json();
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat_id = process.env.TELEGRAM_CHAT_ID;

  // Check for environment variables
  if (!token || !chat_id) {
    console.error("Missing Telegram Bot Token or Chat ID in environment variables.");
    return NextResponse.json({
      success: false,
      message: "Missing Telegram Bot Token or Chat ID in environment variables.",
    }, { status: 400 });
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const message = `New message from ${payload.name}\n\nEmail: ${payload.email}\n\nMessage:\n ${payload.message}\n\n`;

    const res = await axios.post(url, {
      chat_id: chat_id,
      text: message
    });

    if (res.data.ok) {
      return NextResponse.json({
        success: true,
        message: "Message sent successfully!",
      }, { status: 200 });
    } else {
      console.error("Failed to send message, Telegram API response:", res.data);
      return NextResponse.json({
        success: false,
        message: "Message sending failed.",
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Error sending message:", error.response ? error.response.data : error.message);
    return NextResponse.json({
      message: error.response ? error.response.data : "Message sending failed!",
      success: false,
    }, { status: 500 });
  }
};
