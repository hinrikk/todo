import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./index";

async function runMigrations() {
  await migrate(db, {
    migrationsFolder: "./drizzle",
  });

  console.log("Migrations completed");
  process.exit(0);
}

runMigrations().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});