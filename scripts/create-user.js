import Database from 'better-sqlite3';
import bcrypt from 'bcrypt';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { users } from '../src/lib/server/db/schema.js';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('[ERROR] DATABASE_URL is not set');
  process.exit(1);
}

const client = new Database(DATABASE_URL);
const db = drizzle(client);

const [firstName, lastName, role, email, password] = process.argv.slice(2);
if (
  !firstName ||
  !lastName ||
  !email ||
  !password ||
  !role ||
  !['superuser', 'admin'].includes(role)
) {
  console.log(
    'Usage: npm run app:create-user <first_name> <last_name> <superuser|admin> <email> <password>'
  );
  process.exit(1);
}

const salt = await bcrypt.genSalt();
const hashedPassword = await bcrypt.hash(password, salt);
await db.insert(users).values({
  firstName,
  lastName,
  role,
  email,
  password: hashedPassword,
});

console.log(`🎉 ${firstName} has been created!`);
