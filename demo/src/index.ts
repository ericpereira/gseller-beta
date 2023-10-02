import { bootstrap, runMigrations } from '@ericpereiraglobalsys/core';
import { config } from './vendure-config';

runMigrations(config)
    .then(() => bootstrap(config))
    .catch(err => {
        console.log(err);
    });
