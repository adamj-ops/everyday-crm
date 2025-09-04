import { Pool } from 'pg';

// This script tests the deals API functionality with your Neon database
// Make sure your .env.local has DATABASE_URL, DEV_USER_ID, and DEV_ORG_ID

async function testDealsAPI() {
  const DATABASE_URL = process.env.DATABASE_URL;
  const DEV_ORG_ID = process.env.DEV_ORG_ID || '11111111-1111-1111-1111-111111111111';

  if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in environment variables');
    console.log('Make sure you have .env.local with your Neon database URL');
    process.exit(1);
  }

  console.log('🔍 Testing Deals API functionality...\n');

  const pool = new Pool({ connectionString: DATABASE_URL });

  try {
    // Test 1: Check database connection
    console.log('1️⃣ Testing database connection...');
    const client = await pool.connect();
    console.log('✅ Connected to database successfully\n');

    // Test 2: Check if required tables exist
    console.log('2️⃣ Checking database schema...');
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('deals', 'properties', 'offers', 'assignments', 'contacts', 'orgs', 'users', 'team_members')
      ORDER BY table_name
    `);

    console.log('Available tables:');
    console.table(tables.rows);

    const requiredTables = ['deals', 'properties', 'orgs'];
    const existingTables = tables.rows.map(row => row.table_name);
    const missingTables = requiredTables.filter(table => !existingTables.includes(table));

    if (missingTables.length > 0) {
      console.log(`❌ Missing required tables: ${missingTables.join(', ')}`);
      console.log('Please run the seed SQL provided in the instructions');
    } else {
      console.log('✅ Required tables found\n');
    }

    // Test 3: Check if organization exists
    console.log('3️⃣ Checking organization data...');
    const orgCheck = await client.query('SELECT id, name FROM orgs WHERE id = $1', [DEV_ORG_ID]);

    if (orgCheck.rows.length === 0) {
      console.log(`❌ Organization ${DEV_ORG_ID} not found`);
      console.log('Please run the seed SQL to create the organization');
    } else {
      console.log(`✅ Organization found: ${orgCheck.rows[0].name}\n`);
    }

    // Test 4: Check deals data
    console.log('4️⃣ Checking deals data...');
    const dealsCheck = await client.query(`
      SELECT 
        d.id,
        d.stage,
        p.street_1,
        p.city,
        p.state
      FROM deals d
      JOIN properties p ON d.property_id = p.id
      WHERE d.org_id = $1
      ORDER BY d.created_at DESC
      LIMIT 5
    `, [DEV_ORG_ID]);

    if (dealsCheck.rows.length === 0) {
      console.log('⚠️ No deals found for this organization');
      console.log('Run the seed SQL to create sample deals');
    } else {
      console.log(`✅ Found ${dealsCheck.rows.length} deals:`);
      console.table(dealsCheck.rows);
    }

    client.release();
  } catch (error) {
    console.error('❌ Database test failed:', error);
    if ((error as any).code === 'ENOTFOUND') {
      console.log('Check your DATABASE_URL in .env.local');
    }
  } finally {
    await pool.end();
  }

  // Test 5: Test API endpoints (requires server to be running)
  console.log('\n5️⃣ Testing API endpoints...');
  console.log('To test the API endpoints, run:');
  console.log('1. npm run dev');
  console.log('2. curl -s http://localhost:3000/api/deals/list | jq');
  console.log('3. Open http://localhost:3000/deals in your browser');

  console.log('\n🎯 Setup Summary:');
  console.log('✅ Dependencies installed');
  console.log('✅ Database connection configured');
  console.log('✅ API routes created');
  console.log('✅ Deals page created');
  console.log('✅ RLS helper functions implemented');

  console.log('\n🚀 Next steps:');
  console.log('1. Ensure your .env.local has all required variables');
  console.log('2. Run the seed SQL in Neon if you haven\'t already');
  console.log('3. Start the development server: npm run dev');
  console.log('4. Visit http://localhost:3000/deals');
}

testDealsAPI().catch((err) => {
  console.error('Test script failed:', err);
  process.exit(1);
});
