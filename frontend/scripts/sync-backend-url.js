const fs = require('fs');
const os = require('os');
const path = require('path');

const ENV_PATH = path.join(__dirname, '..', '.env');
const BACKEND_PORT = 4000;
const IGNORED_INTERFACES = /virtualbox|vmware|hyper-v|v-?ethernet|loopback|tailscale|docker|wsl/i;

function findLanIp() {
  const interfaces = os.networkInterfaces();
  const candidates = [];

  for (const [name, addrs] of Object.entries(interfaces)) {
    if (!addrs || IGNORED_INTERFACES.test(name)) continue;

    for (const addr of addrs) {
      if (addr.family === 'IPv4' && !addr.internal) {
        candidates.push({ name, address: addr.address });
      }
    }
  }

  if (candidates.length === 0) return null;

  return (
    candidates.find((c) => /wi-?fi/i.test(c.name))?.address ??
    candidates.find((c) => /ethernet/i.test(c.name))?.address ??
    candidates[0].address
  );
}

function updateEnvFile(ip) {
  const backendUrl = `http://${ip}:${BACKEND_PORT}`;
  const line = `EXPO_PUBLIC_BACKEND_URL=${backendUrl}`;
  const contents = fs.existsSync(ENV_PATH) ? fs.readFileSync(ENV_PATH, 'utf8') : '';

  const updated = /^EXPO_PUBLIC_BACKEND_URL=.*$/m.test(contents)
    ? contents.replace(/^EXPO_PUBLIC_BACKEND_URL=.*$/m, line)
    : contents.trimEnd() + (contents.trim() ? '\n' : '') + line + '\n';

  fs.writeFileSync(ENV_PATH, updated);
  console.log(`[sync-backend-url] EXPO_PUBLIC_BACKEND_URL set to ${backendUrl}`);
}

const ip = findLanIp();

if (!ip) {
  console.warn('[sync-backend-url] Could not detect a LAN IP address — leaving EXPO_PUBLIC_BACKEND_URL as-is.');
  process.exit(0);
}

updateEnvFile(ip);
