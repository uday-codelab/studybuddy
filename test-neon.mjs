import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';

const env = readFileSync('.env.local', 'utf8');
env.split('\n').forEach(line => {
  const [key, ...val] = line.split('=');
  if (key && val.length) process.env[key.trim()] = val.join('=').trim();
});

const sql = neon(process.env.DATABASE_URL);

try {
  const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
  console.log('📋 Tables:', tables);
  
  const count = await sql`SELECT COUNT(*) as total FROM document_chunks`;
  console.log('📊 Chunk count:', count);
} catch(e) {
  console.error('❌ Failed:', e.message);
}