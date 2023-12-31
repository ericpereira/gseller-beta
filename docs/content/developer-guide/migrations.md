---
title: "Migrations"
showtoc: true
---
# Migrations

Database migrations are needed whenever the database schema changes. This can be caused by:

* changes to the [CustomFields](https://www.vendure.io/docs/developer-guide/customizing-models/) configuration.
* new [database entities defined by plugins](https://www.vendure.io/docs/typescript-api/plugin/vendure-plugin-metadata/#entities)
* occasional changes to the core Vendure database schema when updating to newer versions

## Synchronize vs migrate

TypeORM (which Vendure uses to interact with the database) has a `synchronize` option which, when set to `true`, will automatically update your database schema to reflect the current Vendure configuration.

This is convenient while developing, but should not be used in production, since a misconfiguration could potentially delete production data. In this case, migrations should be used.

## Migrations in Vendure

Vendure exposes a some helper function which wrap around the underlying [TypeORM migration functionality](https://typeorm.io/#/migrations). The reason for using these helper functions rather than using the TypeORM CLI directly is that Vendure generates additional schema information based on custom fields and plugin configurations which are not available to the TypeORM CLI.

To run and revert migrations, ensure that the `dbConnectionOptions.migrations` option is set in your VendureConfig:

```TypeScript
export const config: VendureConfig = {
  // ...
  dbConnectionOptions: {
    // ...
    migrations: [path.join(__dirname, '../migrations/*.ts')],
  }
}
```

### Generate a migration

The [`generateMigration` function]({{< relref "generate-migration" >}}) will compare the provided VendureConfig against the current database schema and generate a new migration file containing SQL statements which, when applied to the current database, will modify the schema to fit with the configuration. It will also contain statements to revert these changes.

### Run migrations

The [`runMigrations` function]({{< relref "run-migrations" >}}) will apply any migrations files found according to the pattern provided to `dbConnectionOptions.migrations` to the database. TypeORM keeps a track of which migrations have already been applied, so running this function multiple times will not apply the same migration more than once.

{{% alert "warning" %}}
⚠ TypeORM will attempt to run each migration inside a transaction. This means that if one of the migration commands fails, then the entire transaction will be rolled back to its original state.

_However_ this is **not supported by MySQL / MariaDB**. This means that when using MySQL or MariaDB, errors in your migration script could leave your database in a broken or inconsistent state. Therefore it is **critical** that you first create a backup of your database before running a migration.
{{< /alert >}}

### Revert a migration

The [`revertLastMigration` function]({{< relref "revert-last-migration" >}}) will revert the last applied migration. If run again it will then revert the one before that, and so on.

## Example

Here is an example script (which ships with projects generated with `@gseller/create`) which provides a command-line program for managing migrations:

```TypeScript
// migrations.ts
import { generateMigration, revertLastMigration, runMigrations } from '@gseller/core';
import program from 'commander';

import { config } from './src/config';

program
    .command('generate <name>')
    .description('Generate a new migration file with the given name')
    .action(name => {
        return generateMigration(config, { name, outputDir: './migrations' });
    });

program
    .command('run')
    .description('Run all pending migrations')
    .action(() => {
        return runMigrations(config);
    });

program
    .command('revert')
    .description('Revert the last applied migration')
    .action(() => {
        return revertLastMigration(config);
    });

program.parse(process.argv);
```

This script can then be run e.g. using `ts-node`:

```shell
ts-node migration.ts generate my-migration
```

This will generate a new migration in the directory specified by the `dbConnectionOptions.migrations` option:

```TypeScript
dbConnectionOptions: {
  migrations: [path.join(__dirname, '../migrations/*.ts')],
}
```

The migration file will be named `migrations/<timestamp>-my-migration.ts`. You should inspect this file to verify the migration commands to be run.

You can then run all migrations which have not yet been run with:
```shell
ts-node migration.ts run
```
