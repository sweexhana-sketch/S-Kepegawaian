import { neon } from '@neondatabase/serverless';
import { hash } from 'bcryptjs';

const dbUrl = 'postgresql://neondb_owner:npg_W9OX1yJxshLZ@ep-muddy-paper-am36bln2-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function run() {
  try {
    const sql = neon(dbUrl);
    const hashedPassword = await hash('password123', 10);
    const users = await sql`SELECT id FROM auth_users WHERE email = 'calvinpapua05@gmail.com'`;
    if(users.length === 0) return console.log('User not found');
    await sql`UPDATE auth_accounts SET password = ${hashedPassword} WHERE "userId" = ${users[0].id}`;
    console.log('Password reset successfully to password123');
  } catch (err) {
    console.error(err);
  }
}
run();
