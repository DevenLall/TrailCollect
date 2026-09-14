const { google } = require('googleapis');

const oAuth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET
);
oAuth2Client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });

const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

function buildRawMessage({ to, from, subject, body }) {
  const message = [
    `From: ${from}`,
    `To: ${to}`,
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${subject}`,
    '',
    body,
  ].join('\n');

  return Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

async function sendOtpEmail(toEmail, code) {
  const raw = buildRawMessage({
    to: toEmail,
    from: process.env.GMAIL_SENDER_EMAIL,
    subject: 'Your TrailCollect verification code',
    body: `Your verification code is ${code}.\n\nThis code expires in 5 minutes. If you didn't request this, you can ignore this email.`,
  });

  await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw },
  });
}

module.exports = { sendOtpEmail };
