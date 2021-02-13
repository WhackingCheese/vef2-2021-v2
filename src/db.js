const pg = require('pg');
const fs = require('fs');
const util = require('util');
const dotenv = require('dotenv');

dotenv.config();

const {
  DATABASE_URL: connectionString,
  NODE_ENV: nodeEnv = '',
} = process.env;
console.info('process.env :>> ', process.env.DATABASE_URL);
if (!connectionString) {
  console.error('Vantar DATABASE_URL!');
  process.exit(1);
}
const ssl = nodeEnv !== 'development' ? { rejectUnauthorized: false } : false;
const pool = new pg.Pool({ connectionString, ssl });

const readFileAsync = util.promisify(fs.readFile);

async function insert(data) {
  const q = `
  INSERT INTO signatures
  (name, nationalId, comment, anonymous)
  VALUES
  ($1, $2, $3, $4)`;
  values = [data.name, data.ssid, data.comment, data.anon];
  return query(q, values=values);
}

async function selectAllNotAnon() {
  const result = await (await query('SELECT * FROM signatures WHERE anonymous is false')).rows;
  return result;
}

async function query(q, values = []) {
  const client = await pool.connect();
  try {
    const result = await client.query(q, values);
    return result;
  } catch (err) {
    throw err;
  } finally {
    await client.end();
  }
}

async function setup() {
  await query('DROP TABLE IF EXISTS signatures');
  try {
    const createTable = await readFileAsync('./src/sql/schema.sql');
    await query(createTable.toString('utf-8'));
    const insertData = await readFileAsync('./src/sql/fake.sql');
    await query(insertData.toString('utf-8'));
  } catch (e) {
    console.error(e.message);
  }
}

module.exports = {
  selectAllNotAnon,
  insert,
  setup,
};
