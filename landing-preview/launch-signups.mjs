import { Buffer } from 'node:buffer';
import { createHash, randomUUID } from 'node:crypto';
import { link, mkdir, unlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { env } from 'node:process';
import { fileURLToPath, URL } from 'node:url';
import options from './src/signup-options.json' with { type: 'json' };

const directory = env.BODEUM_SIGNUP_DIR || fileURLToPath(new URL('./.launch-signups/', import.meta.url));

function respond(response, status, accepted = false) {
  response.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
  response.end(JSON.stringify({ accepted }));
}

async function subscribe(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return respond(response, 405);
  }
  if (request.headers['sec-fetch-site'] === 'cross-site') return respond(response, 403);
  if (request.headers['content-type']?.split(';')[0] !== 'application/json') return respond(response, 415);

  const chunks = [];
  let length = 0;
  for await (const chunk of request) {
    length += chunk.length;
    if (length > 2048) return respond(response, 413);
    chunks.push(chunk);
  }
  let payload;
  try {
    payload = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    return respond(response, 400);
  }
  const email = typeof payload?.email === 'string' ? payload.email.trim() : '';
  const { role = '', ageGroup = '' } = payload ?? {};
  if ((role !== '' && !options.roles.includes(role)) || (ageGroup !== '' && !options.ageGroups.includes(ageGroup))) {
    return respond(response, 400);
  }
  if (payload?.consent !== true || email.length > 254 || !/^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(email)) {
    return respond(response, 400);
  }

  await mkdir(directory, { recursive: true, mode: 0o700 });
  const key = createHash('sha256').update(email.toLowerCase()).digest('hex');
  const temporary = join(directory, randomUUID() + '.tmp');
  const record = {
    email,
    ...(role && role !== '답하지 않을래요' ? { role } : {}),
    ...(ageGroup && ageGroup !== '답하지 않을래요' ? { ageGroup } : {}),
    consentVersion: 2,
    subscribedAt: new Date().toISOString(),
  };
  try {
    await writeFile(temporary, JSON.stringify(record) + '\n', { flag: 'wx', mode: 0o600 });
    await link(temporary, join(directory, key + '.json'));
    return respond(response, 201, true);
  } catch (error) {
    if (error.code === 'EEXIST') return respond(response, 200, true);
    throw error;
  } finally {
    await unlink(temporary).catch(() => {});
  }
}

function install(server) {
  server.middlewares.use((request, response, next) => {
    if (request.url?.split('?')[0] !== '/api/launch-signups') return next();
    subscribe(request, response).catch(() => {
      if (!response.headersSent) respond(response, 500);
    });
  });
}

export const launchSignups = () => ({
  name: 'bodeum-launch-signups',
  config: () => ({
    server: { fs: { deny: ['.env', '.env.*', '*.{crt,pem}', '**/.git/**', '**/.launch-signups/**'] } },
  }),
  configureServer: install,
  configurePreviewServer: install,
});
