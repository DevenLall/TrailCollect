const crypto = require('crypto');
const { supabaseAdmin } = require('./supabaseAdmin');

const CODE_TTL_MS = 5 * 60 * 1000;
const RESEND_COOLDOWN_MS = 30 * 1000;
const MAX_ATTEMPTS = 5;

function generateCode() {
  return crypto.randomInt(0, 1000000).toString().padStart(6, '0');
}

function hashCode(code) {
  return crypto.createHash('sha256').update(code).digest('hex');
}

async function createOtp(email) {
  const { data: recent, error: lookupError } = await supabaseAdmin
    .from('otp_codes')
    .select('created_at')
    .eq('email', email)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (lookupError) throw lookupError;

  if (recent) {
    const elapsed = Date.now() - new Date(recent.created_at).getTime();
    if (elapsed < RESEND_COOLDOWN_MS) {
      const err = new Error('Please wait before requesting another code.');
      err.code = 'COOLDOWN';
      err.retryAfterMs = RESEND_COOLDOWN_MS - elapsed;
      throw err;
    }
  }

  const code = generateCode();
  const { error: insertError } = await supabaseAdmin.from('otp_codes').insert({
    email,
    code_hash: hashCode(code),
    expires_at: new Date(Date.now() + CODE_TTL_MS).toISOString(),
  });

  if (insertError) throw insertError;

  return code;
}

async function verifyOtp(email, code) {
  const { data: row, error } = await supabaseAdmin
    .from('otp_codes')
    .select('*')
    .eq('email', email)
    .eq('consumed', false)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!row) return { ok: false, reason: 'NOT_FOUND' };

  if (new Date(row.expires_at).getTime() < Date.now()) {
    return { ok: false, reason: 'EXPIRED' };
  }

  if (row.attempts >= MAX_ATTEMPTS) {
    return { ok: false, reason: 'TOO_MANY_ATTEMPTS' };
  }

  if (hashCode(code) !== row.code_hash) {
    await supabaseAdmin
      .from('otp_codes')
      .update({ attempts: row.attempts + 1 })
      .eq('id', row.id);
    return { ok: false, reason: 'INVALID' };
  }

  await supabaseAdmin.from('otp_codes').update({ consumed: true }).eq('id', row.id);

  return { ok: true };
}

module.exports = { createOtp, verifyOtp };
