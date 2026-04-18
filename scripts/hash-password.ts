import { randomBytes, scryptSync } from "node:crypto";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const SCRYPT_KEYLEN = 32;
const SCRYPT_SALT_LEN = 16;

function hashPassword(plain: string): string {
  const salt = randomBytes(SCRYPT_SALT_LEN);
  const derived = scryptSync(plain, salt, SCRYPT_KEYLEN, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
  });
  return [
    "scrypt",
    SCRYPT_N,
    SCRYPT_R,
    SCRYPT_P,
    salt.toString("hex"),
    derived.toString("hex"),
  ].join("$");
}

async function main(): Promise<void> {
  const rl = createInterface({ input: stdin, output: stdout, terminal: true });
  const plain = await rl.question("Admin password to hash: ");
  rl.close();

  if (!plain || plain.length < 12) {
    console.error("Password must be at least 12 characters.");
    process.exit(1);
  }

  const hashKey = "ADMIN_PASSWORD_HASH";
  const secretKey = "ADMIN_SECRET";
  const hashValue = hashPassword(plain);
  const secretValue = randomBytes(32).toString("hex");

  console.log(`\n${hashKey}=${hashValue}`);
  console.log(`\n${secretKey} suggestion (64 random hex chars):`);
  console.log(`${secretKey}=${secretValue}`);
  console.log("\nAdd both to Vercel environment variables. Never commit them.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
