const { Pool } = require('@neondatabase/serverless');
const dotenv = require('dotenv');
const fs = require('fs');

if (fs.existsSync('.env')) {
  dotenv.config({ path: '.env' });
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function init() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS auth_users (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        "emailVerified" TIMESTAMPTZ,
        image TEXT
      );

      CREATE TABLE IF NOT EXISTS auth_accounts (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        "userId" UUID NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
        type VARCHAR(255) NOT NULL,
        provider VARCHAR(255) NOT NULL,
        "providerAccountId" VARCHAR(255) NOT NULL,
        refresh_token TEXT,
        access_token TEXT,
        expires_at BIGINT,
        id_token TEXT,
        scope TEXT,
        session_state TEXT,
        token_type TEXT,
        password TEXT,
        UNIQUE (provider, "providerAccountId")
      );

      CREATE TABLE IF NOT EXISTS auth_sessions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        "sessionToken" VARCHAR(255) UNIQUE NOT NULL,
        "userId" UUID NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
        expires TIMESTAMPTZ NOT NULL
      );

      CREATE TABLE IF NOT EXISTS auth_verification_token (
        identifier VARCHAR(255),
        token VARCHAR(255),
        expires TIMESTAMPTZ NOT NULL,
        PRIMARY KEY (identifier, token)
      );
    `);
    console.log('Database schema initialized successfully.');
  } catch (err) {
    console.error('Error initializing database schema:', err.message);
  } finally {
    pool.end();
  }
}

init();
