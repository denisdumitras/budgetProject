generate migration: node --no-warnings -r ts-node/register ./node_modules/typeorm/cli.js migration:generate src/migrations/InitialMigration -d src/data-source.ts

npm run migration:run
