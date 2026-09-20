// teste-conexao.ts
import { Client } from "pg";

const client = new Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

async function testar() {
  await client.connect();

  await client.query(`
    CREATE TABLE IF NOT EXISTS teste (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(50)
    )
  `);

  await client.query(`INSERT INTO teste (nome) VALUES ('funcionou')`);

  const resultado = await client.query("SELECT * FROM teste");
  console.log(resultado.rows);

  await client.end();
}

testar();
