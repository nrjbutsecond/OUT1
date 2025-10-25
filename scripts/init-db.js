#!/usr/bin/env node

/**
 * Script to initialize SQLite database manually
 * Run with: node scripts/init-db.js
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

async function initDatabase() {
  console.log('🚀 Initializing database...\n');

  try {
    // Set environment variable
    process.env.DATABASE_URL = 'file:./dev.db';

    console.log('📦 Generating Prisma Client...');
    await execAsync('npx prisma generate', {
      env: {
        ...process.env,
        PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING: '1'
      }
    });
    console.log('✅ Prisma Client generated\n');

    console.log('🗄️  Creating database schema...');
    await execAsync('npx prisma db push --skip-generate', {
      env: {
        ...process.env,
        PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING: '1'
      }
    });
    console.log('✅ Database schema created\n');

    console.log('🌱 Seeding database...');
    await execAsync('npm run db:seed');
    console.log('✅ Database seeded\n');

    console.log('✨ Database initialization complete!');
    console.log('\n📝 Next steps:');
    console.log('   1. Run: npm run dev');
    console.log('   2. Visit: http://localhost:3000');
    console.log('\n🔐 Admin credentials:');
    console.log('   Email: admin@ton-platform.vn');
    console.log('   Password: admin123');

  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    console.error('\n💡 Please try manually:');
    console.error('   1. set DATABASE_URL=file:./dev.db');
    console.error('   2. npx prisma db push');
    console.error('   3. npm run db:seed');
    process.exit(1);
  }
}

initDatabase();
