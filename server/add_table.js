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

async function addTable() {
  try {
    const res = await localPool.query(`
      SELECT column_name, data_type, character_maximum_length, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'pickle_booking_assistants'
      ORDER BY ordinal_position;
    `);
    
    let columnsDef = res.rows.map(row => {
      let type = row.data_type;
      if (type === 'character varying' && row.character_maximum_length) {
        type = `varchar(${row.character_maximum_length})`;
      } else if (type === 'timestamp without time zone') {
        type = 'timestamp';
      }
      
      let def = `${row.column_name} ${type}`;
      
      if (row.column_default && row.column_default.includes('nextval(')) {
         def = `${row.column_name} SERIAL`; // Replace explicit sequence with SERIAL
      } else {
        if (row.is_nullable === 'NO') {
          def += ' NOT NULL';
        }
        if (row.column_default) {
          def += ` DEFAULT ${row.column_default}`;
        }
      }
      return def;
    });

    const createSql = `CREATE TABLE IF NOT EXISTS pickle_booking_assistants (\n  ${columnsDef.join(',\n  ')}\n);`;
    console.log('Executing on remote:\n', createSql);

    await remotePool.query(createSql);
    
    // Check if id is primary key locally and apply it
    const pkRes = await localPool.query(`
      SELECT a.attname
      FROM   pg_index i
      JOIN   pg_attribute a ON a.attrelid = i.indrelid
                           AND a.attnum = ANY(i.indkey)
      WHERE  i.indrelid = 'pickle_booking_assistants'::regclass
      AND    i.indisprimary;
    `);
    if (pkRes.rows.length > 0) {
      const pks = pkRes.rows.map(r => r.attname);
      try {
        await remotePool.query(`ALTER TABLE pickle_booking_assistants ADD PRIMARY KEY (${pks.join(', ')});`);
        console.log('Added primary key:', pks.join(', '));
      } catch(e) {
        // Might already exist
      }
    }

    console.log('Table created successfully on Supabase.');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await localPool.end();
    await remotePool.end();
    process.exit(0);
  }
}

addTable();
