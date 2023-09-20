#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
import { INestApplication } from '@nestjs/common';
import program from 'commander';
import fs from 'fs-extra';
import path from 'path';

import { logColored } from './cli-utils';
import { populateInitialData } from './populate';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const version = require('../../package.json').version;

/* eslint-disable no-console */
logColored(`
                      _
                     | |
 __   _____ _ __   __| |_   _ _ __ ___
 \\ \\ / / _ \\ '_ \\ / _\` | | | | '__/ _ \\
  \\ V /  __/ | | | (_| | |_| | | |  __/
   \\_/ \\___|_| |_|\\__,_|\\__,_|_|  \\___|
                                       `);

program.version(`Vendure CLI v${version as string}`, '-v --version').name('vendure');

program
    .command('init <initDataFile>')
    .description('Import initial data from the specified json file')
    .action(async (initDataFile, command) => {
        const filePath = path.join(process.cwd(), initDataFile);
        logColored(`\nPopulating initial data from "${filePath}"...\n`);
        const initialData = require(filePath);
        const app = await getApplicationRef();
        if (app) {
            await populateInitialData(app, initialData);
            logColored('\nDone!');
            await app.close();
        }
        process.exit(0);
    });
program
    .command('create-collections <initDataFile>')
    .description('Create collections from the specified json file')
    .action(async (initDataFile, command) => {
        const filePath = path.join(process.cwd(), initDataFile);
        logColored(`\nCreating collections from "${filePath}"...\n`);
        const initialData = require(filePath);
        const app = await getApplicationRef();
        if (app) {
            logColored('\nDone!');
            await app.close();
        }
        process.exit(0);
    });
program.parse(process.argv);
if (!process.argv.slice(2).length) {
    program.help();
}

async function getApplicationRef(): Promise<INestApplication | undefined> {
    const tsConfigFile = path.join(process.cwd(), 'vendure-config.ts');
    const jsConfigFile = path.join(process.cwd(), 'vendure-config.js');
    let isTs = false;
    let configFile: string | undefined;
    if (fs.existsSync(tsConfigFile)) {
        configFile = tsConfigFile;
        isTs = true;
    } else if (fs.existsSync(jsConfigFile)) {
        configFile = jsConfigFile;
    }

    if (!configFile) {
        console.error('Could not find a config file');
        console.error(`Checked "${tsConfigFile}", "${jsConfigFile}"`);
        process.exit(1);
        return;
    }

    if (isTs) {
        // we expect ts-node to be available
        const tsNode = require('ts-node');
        if (!tsNode) {
            console.error('For "populate" to work with TypeScript projects, you must have ts-node installed');
            process.exit(1);
            return;
        }
        require('ts-node').register();
    }

    const index = require(configFile);

    if (!index) {
        console.error(`Could not read the contents of "${configFile}"`);
        process.exit(1);
        return;
    }
    if (!index.config) {
        console.error(`The file "${configFile}" does not export a "config" object`);
        process.exit(1);
        return;
    }

    const config = index.config;

    // Force the sync mode on, so that all the tables are created
    // on this initial run.
    config.dbConnectionOptions.synchronize = true;

    const { bootstrap } = require('@vendure/core');
    console.log('Bootstrapping Vendure server...');
    const app = await bootstrap(config);
    return app;
}
