const { Pool } = require('pg');

const localPool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'clinic_booking',
  password: 'Ch3l3l3t110977',
  port: 5432,
});

const remotePool = new Pool({
  connectionString: 'postgresql://postgres.zhtyktlktykotyzhxyps:Ch3l3l3t110977@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres'
});

async function compare() {
  try {
    const localRes = await localPool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE';
    `);
    const localTables = localRes.rows.map(r => r.table_name);

    const remoteRes = await remotePool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE';
    `);
    const remoteTables = remoteRes.rows.map(r => r.table_name);

    const localOnly = localTables.filter(t => !remoteTables.includes(t));
    const remoteOnly = remoteTables.filter(t => !localTables.includes(t));
    const both = localTables.filter(t => remoteTables.includes(t));

    console.log('--- TABLES IN BOTH ---');
    console.log(both.join(', ') || 'None');
    console.log('\n--- LOCAL ONLY TABLES ---');
    console.log(localOnly.join(', ') || 'None');
    console.log('\n--- SUPABASE ONLY TABLES ---');
    console.log(remoteOnly.join(', ') || 'None');

  } catch (error) {
    console.error('Error during comparison:', error);
  } finally {
    await localPool.end();
    await remotePool.end();
    process.exit(0);
  }
}

compare();
