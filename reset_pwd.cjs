require('dotenv').config();
const { neon } = require('@neondatabase/serverless');
const { hash } = require('bcryptjs');

async function run() {
  try {
    const sql = neon(process.env.DATABASE_URL);
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
