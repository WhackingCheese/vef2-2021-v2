const { Client } = require('pg');
const fs = require('fs');
const util = require('util');

const connectionString = 'postgres://test:test@localhost'

const readFileAsync = util.promisify(fs.readFile);

async function insert(data) {
  const q = `
  INSERT INTO signatures
  (name, nationalId, comment, anonymous)
  VALUES
  ($1, $2, $3, $4)`;
  values = [data.name, data.ssid, data.comment, data.anon];
  return query(q, values);
}

async function selectAllNotAnon() {
  const result = await (await query('SELECT * FROM signatures WHERE anonymous is false')).rows;
  return result;
}

async function query(q, values=[]) {
  const client = new Client({ connectionString });
  await client.connect();
  try {
    const result = await client.query(q, values);
    return result;
  }
  catch (err) {
    throw err;
  } finally {
    await client.end();
  }
}

async function setup() {
  await query(`DROP TABLE IF EXISTS signatures`);
  try {
    const createTable = await readFileAsync('./src/sql/schema.sql');
    await query(createTable.toString('utf-8'));
    const insertData = await readFileAsync('./src/sql/fake.sql');
    await query(insertData.toString('utf-8'));
  } catch(e) {
    console.error(e.message);
  }
}

module.exports = {
  selectAllNotAnon,
  insert,
  setup
}
