/*
 * Copyright 2020. F5 Networks, Inc. See End User License Agreement ("EULA") for
 * license terms. Notwithstanding anything to the contrary in the EULA, Licensee
 * may copy and modify this software product for its internal business purposes.
 * Further, Licensee may upload, publish and distribute the modified version of
 * the software product on devcentral.f5.com.
 */

'use strict';

import { ExtHttp, Logger } from 'f5-conx-core';
// import  from 'f5-conx-core';
import { AccUpdater } from './acc_updater';

const logger = Logger.getLogger();
logger.console = true;
process.env.F5_CONX_CORE_LOG_LEVEL = 'INFO'

logger.info(' --- starting acc updater ---')

// logger.info('acc updater starting')
// logger.error('log ERROR try?')
// logger.debug('deeeeebbbbbuuuuuugggg')

const latestRelease = 'https://api.github.com/repos/f5devcentral/f5-as3-config-converter/releases/latest'

// node -r ts-node/register --inspect updater/index.ts

const extHttp = new ExtHttp();
const eventr = extHttp.events

eventr
.on('log-http-request', msg => logger.httpRequest(msg))
.on('log-http-response', msg => logger.httpResponse(msg))
.on('log-debug', msg => logger.debug(msg))
.on('log-info', msg => logger.info(msg))
.on('log-error', msg => logger.error(msg));

const accUpdate = new AccUpdater(logger, extHttp);

accUpdate.download()
    .then(dl => {

        
        debugger;
    });