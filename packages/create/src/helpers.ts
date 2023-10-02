/* eslint-disable no-console */
import { execSync } from 'child_process';
import spawn from 'cross-spawn';
import fs from 'fs-extra';
import path from 'path';
import pc from 'picocolors';
import semver from 'semver';

import { SERVER_PORT, TYPESCRIPT_VERSION } from './constants';
import { CliLogLevel, DbType } from './types';

/**
 * If project only contains files generated by GH, it’s safe.
 * Also, if project contains remnant error logs from a previous
 * installation, lets remove them now.
 * We also special case IJ-based products .idea because it integrates with CRA:
 * https://github.com/facebook/create-react-app/pull/368#issuecomment-243446094
 */
export function isSafeToCreateProjectIn(root: string, name: string) {
    // These files should be allowed to remain on a failed install,
    // but then silently removed during the next create.
    const errorLogFilePatterns = ['npm-debug.log', 'yarn-error.log', 'yarn-debug.log'];
    const validFiles = [
        '.DS_Store',
        'Thumbs.db',
        '.git',
        '.gitignore',
        '.idea',
        'README.md',
        'LICENSE',
        '.hg',
        '.hgignore',
        '.hgcheck',
        '.npmignore',
        'mkdocs.yml',
        'docs',
        '.travis.yml',
        '.gitlab-ci.yml',
        '.gitattributes',
        'migration.ts',
        'node_modules',
        'package.json',
        'package-lock.json',
        'src',
        'static',
        'tsconfig.json',
        'yarn.lock',
    ];
    console.log();

    const conflicts = fs
        .readdirSync(root)
        .filter(file => !validFiles.includes(file))
        // IntelliJ IDEA creates module files before CRA is launched
        .filter(file => !/\.iml$/.test(file))
        // Don't treat log files from previous installation as conflicts
        .filter(file => !errorLogFilePatterns.some(pattern => file.indexOf(pattern) === 0));

    if (conflicts.length > 0) {
        console.log(`The directory ${pc.green(name)} contains files that could conflict:`);
        console.log();
        for (const file of conflicts) {
            console.log(`  ${file}`);
        }
        console.log();
        console.log('Either try using a new directory name, or remove the files listed above.');

        return false;
    }

    // Remove any remnant files from a previous installation
    const currentFiles = fs.readdirSync(path.join(root));
    currentFiles.forEach(file => {
        errorLogFilePatterns.forEach(errorLogFilePattern => {
            // This will catch `(npm-debug|yarn-error|yarn-debug).log*` files
            if (file.indexOf(errorLogFilePattern) === 0) {
                fs.removeSync(path.join(root, file));
            }
        });
    });
    return true;
}

export function scaffoldAlreadyExists(root: string, name: string): boolean {
    const scaffoldFiles = ['migration.ts', 'package.json', 'tsconfig.json', 'README.md'];
    const files = fs.readdirSync(root);
    return scaffoldFiles.every(scaffoldFile => files.includes(scaffoldFile));
}

export function checkNodeVersion(requiredVersion: string) {
    if (!semver.satisfies(process.version, requiredVersion)) {
        console.error(
            pc.red(
                'You are running Node %s.\n' +
                    'Vendure requires Node %s or higher. \n' +
                    'Please update your version of Node.',
            ),
            process.version,
            requiredVersion,
        );
        process.exit(1);
    }
}

export function shouldUseYarn() {
    try {
        execSync('yarnpkg --version', { stdio: 'ignore' });
        return true;
    } catch (e: any) {
        return false;
    }
}

export function checkThatNpmCanReadCwd() {
    const cwd = process.cwd();
    let childOutput = null;
    try {
        // Note: intentionally using spawn over exec since
        // the problem doesn't reproduce otherwise.
        // `npm config list` is the only reliable way I could find
        // to reproduce the wrong path. Just printing process.cwd()
        // in a Node process was not enough.
        childOutput = spawn.sync('npm', ['config', 'list']).output.join('');
    } catch (err: any) {
        // Something went wrong spawning node.
        // Not great, but it means we can't do this check.
        // We might fail later on, but let's continue.
        return true;
    }
    if (typeof childOutput !== 'string') {
        return true;
    }
    const lines = childOutput.split('\n');
    // `npm config list` output includes the following line:
    // "; cwd = C:\path\to\current\dir" (unquoted)
    // I couldn't find an easier way to get it.
    const prefix = '; cwd = ';
    const line = lines.find(l => l.indexOf(prefix) === 0);
    if (typeof line !== 'string') {
        // Fail gracefully. They could remove it.
        return true;
    }
    const npmCWD = line.substring(prefix.length);
    if (npmCWD === cwd) {
        return true;
    }
    console.error(
        pc.red(
            'Could not start an npm process in the right directory.\n\n' +
                `The current directory is: ${pc.bold(cwd)}\n` +
                `However, a newly started npm process runs in: ${pc.bold(npmCWD)}\n\n` +
                'This is probably caused by a misconfigured system terminal shell.',
        ),
    );
    if (process.platform === 'win32') {
        console.error(
            pc.red('On Windows, this can usually be fixed by running:\n\n') +
                `  ${pc.cyan('reg')} delete "HKCU\\Software\\Microsoft\\Command Processor" /v AutoRun /f\n` +
                `  ${pc.cyan(
                    'reg',
                )} delete "HKLM\\Software\\Microsoft\\Command Processor" /v AutoRun /f\n\n` +
                pc.red('Try to run the above two lines in the terminal.\n') +
                pc.red(
                    'To learn more about this problem, read: https://blogs.msdn.microsoft.com/oldnewthing/20071121-00/?p=24433/',
                ),
        );
    }
    return false;
}

/**
 * Install packages via npm or yarn.
 * Based on the install function from https://github.com/facebook/create-react-app
 */
export function installPackages(
    root: string,
    useYarn: boolean,
    dependencies: string[],
    isDev: boolean,
    logLevel: CliLogLevel,
    isCi: boolean = false,
): Promise<void> {
    return new Promise((resolve, reject) => {
        let command: string;
        let args: string[];
        if (useYarn) {
            command = 'yarnpkg';
            args = ['add', '--exact', '--ignore-engines'];
            if (isDev) {
                args.push('--dev');
            }
            if (isCi) {
                // In CI, publish to Verdaccio
                // See https://github.com/yarnpkg/yarn/issues/6029
                args.push('--registry http://localhost:4873/');
                // Increase network timeout
                // See https://github.com/yarnpkg/yarn/issues/4890#issuecomment-358179301
                args.push('--network-timeout 300000');
            }
            args = args.concat(dependencies);

            // Explicitly set cwd() to work around issues like
            // https://github.com/facebook/create-react-app/issues/3326.
            // Unfortunately we can only do this for Yarn because npm support for
            // equivalent --prefix flag doesn't help with this issue.
            // This is why for npm, we run checkThatNpmCanReadCwd() early instead.
            args.push('--cwd');
            args.push(root);
        } else {
            command = 'npm';
            args = ['install', '--save', '--save-exact', '--loglevel', 'error'].concat(dependencies);
            if (isDev) {
                args.push('--save-dev');
            }
        }

        if (logLevel === 'verbose') {
            args.push('--verbose');
        }

        const child = spawn(command, args, { stdio: logLevel === 'silent' ? 'ignore' : 'inherit' });
        child.on('close', code => {
            if (code !== 0) {
                let message = 'An error occurred when installing dependencies.';
                if (logLevel === 'silent') {
                    message += ' Try running with `--log-level info` or `--log-level verbose` to diagnose.';
                }
                reject({
                    message,
                    command: `${command} ${args.join(' ')}`,
                });
                return;
            }
            resolve();
        });
    });
}

export function getDependencies(
    dbType: DbType,
    vendurePkgVersion = '',
): { dependencies: string[]; devDependencies: string[] } {
    const dependencies = [
        `@ericpereiraglobalsys/core${vendurePkgVersion}`,
        `@ericpereiraglobalsys/email-plugin${vendurePkgVersion}`,
        `@ericpereiraglobalsys/asset-server-plugin${vendurePkgVersion}`,
        `@ericpereiraglobalsys/admin-ui-plugin${vendurePkgVersion}`,
        'dotenv',
        dbDriverPackage(dbType),
        `typescript@${TYPESCRIPT_VERSION}`,
    ];
    const devDependencies = ['concurrently', 'ts-node'];
    return { dependencies, devDependencies };
}

/**
 * Returns the name of the npm driver package for the
 * selected database.
 */
function dbDriverPackage(dbType: DbType): string {
    switch (dbType) {
        case 'mysql':
        case 'mariadb':
            return 'mysql';
        case 'postgres':
            return 'pg';
        case 'sqlite':
            return 'better-sqlite3';
        case 'sqljs':
            return 'sql.js';
        case 'mssql':
            return 'mssql';
        case 'oracle':
            return 'oracledb';
        default:
            const n: never = dbType;
            console.error(pc.red(`No driver package configured for type "${dbType as string}"`));
            return '';
    }
}

/**
 * Checks that the specified DB connection options are working (i.e. a connection can be
 * established) and that the named database exists.
 */
export function checkDbConnection(options: any, root: string): Promise<true> {
    switch (options.type) {
        case 'mysql':
            return checkMysqlDbExists(options, root);
        case 'postgres':
            return checkPostgresDbExists(options, root);
        default:
            return Promise.resolve(true);
    }
}

async function checkMysqlDbExists(options: any, root: string): Promise<true> {
    const mysql = await import(path.join(root, 'node_modules/mysql'));
    const connectionOptions = {
        host: options.host,
        user: options.username,
        password: options.password,
        port: options.port,
        database: options.database,
    };
    const connection = mysql.createConnection(connectionOptions);

    return new Promise<boolean>((resolve, reject) => {
        connection.connect((err: any) => {
            if (err) {
                if (err.code === 'ER_BAD_DB_ERROR') {
                    throwDatabaseDoesNotExist(options.database);
                }
                throwConnectionError(err);
            }
            resolve(true);
        });
    }).then(() => {
        return new Promise((resolve, reject) => {
            connection.end((err: any) => {
                resolve(true);
            });
        });
    });
}

async function checkPostgresDbExists(options: any, root: string): Promise<true> {
    const { Client } = await import(path.join(root, 'node_modules/pg'));
    const connectionOptions = {
        host: options.host,
        user: options.username,
        password: options.password,
        port: options.port,
        database: options.database,
        schema: options.schema,
    };
    const client = new Client(connectionOptions);

    try {
        await client.connect();

        const schema = await client.query(
            `SELECT schema_name FROM information_schema.schemata WHERE schema_name = '${
                options.schema as string
            }'`,
        );
        if (schema.rows.length === 0) {
            throw new Error('NO_SCHEMA');
        }
    } catch (e: any) {
        if (e.code === '3D000') {
            throwDatabaseDoesNotExist(options.database);
        } else if (e.message === 'NO_SCHEMA') {
            throwDatabaseSchemaDoesNotExist(options.database, options.schema);
        }
        throwConnectionError(e);
        await client.end();
        throw e;
    }
    await client.end();
    return true;
}

function throwConnectionError(err: any) {
    throw new Error(
        'Could not connect to the database. ' +
            `Please check the connection settings in your Vendure config.\n[${
                (err.message || err.toString()) as string
            }]`,
    );
}

function throwDatabaseDoesNotExist(name: string) {
    throw new Error(`Database "${name}" does not exist. Please create the database and then try again.`);
}

function throwDatabaseSchemaDoesNotExist(dbName: string, schemaName: string) {
    throw new Error(
        `Schema "${dbName}.${schemaName}" does not exist. Please create the schema "${schemaName}" and then try again.`,
    );
}

export function isServerPortInUse(): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const tcpPortUsed = require('tcp-port-used');
    try {
        return tcpPortUsed.check(SERVER_PORT);
    } catch (e: any) {
        console.log(pc.yellow(`Warning: could not determine whether port ${SERVER_PORT} is available`));
        return Promise.resolve(false);
    }
}
