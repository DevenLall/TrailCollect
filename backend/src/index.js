require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createOtp, verifyOtp } = require('./otp');
const { sendOtpEmail } = require('./gmail');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/otp/request', async (req, res) => {
  const { email } = req.body ?? {};
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ ok: false, error: 'Email is required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const code = await createOtp(normalizedEmail);
    await sendOtpEmail(normalizedEmail, code);
    res.json({ ok: true });
  } catch (err) {
    if (err.code === 'COOLDOWN') {
      return res.status(429).json({ ok: false, error: err.message, retryAfterMs: err.retryAfterMs });
    }
    console.error('otp/request failed:', err);
    res.status(500).json({ ok: false, error: 'Could not send verification code.' });
  }
});

app.post('/api/otp/verify', async (req, res) => {
  const { email, code } = req.body ?? {};
  if (!email || !code) {
    return res.status(400).json({ ok: false, error: 'Email and code are required.' });
  }

  const messages = {
    NOT_FOUND: 'No code was requested for this email.',
    EXPIRED: 'This code has expired. Request a new one.',
    TOO_MANY_ATTEMPTS: 'Too many incorrect attempts. Request a new code.',
    INVALID: 'That code is incorrect.',
  };

  try {
    const result = await verifyOtp(email.trim().toLowerCase(), String(code).trim());
    if (!result.ok) {
      return res.status(400).json({ ok: false, error: messages[result.reason] ?? 'Verification failed.' });
    }
    res.json({ ok: true });
  } catch (err) {
    console.error('otp/verify failed:', err);
    res.status(500).json({ ok: false, error: 'Could not verify code.' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`OTP backend listening on port ${PORT}`));
