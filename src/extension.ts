/**
 * Copyright 2021 F5 Networks, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

import {
    ExtensionContext,
    commands,
    window,
    ProgressLocation
} from 'vscode';

import {
    displayJsonInEditor,
    getText
} from './util';

import { Logger } from 'f5-conx-core';

import { acc } from './accWrapper'
import { EventEmitter } from 'events';

const logger = Logger.getLogger();
logger.console = false;
// delete process.env.F5_CONX_CORE_LOG_LEVEL;

if (!process.env.F5_CONX_CORE_LOG_LEVEL) {
    // if this isn't set by something else, set it to debug for dev
    process.env.F5_CONX_CORE_LOG_LEVEL = 'DEBUG';
}

// create OUTPUT channel
const f5OutputChannel = window.createOutputChannel('f5');

// make visible
f5OutputChannel.show();

// inject vscode output into logger
logger.output = function (log: string) {
    f5OutputChannel.appendLine(log);
};

const eventer = new EventEmitter()
    .on('log-http-request', msg => logger.httpRequest(msg))
    .on('log-http-response', msg => logger.httpResponse(msg))
    .on('log-debug', msg => logger.debug(msg))
    .on('log-info', msg => logger.info(msg))
    .on('log-warn', msg => logger.warning(msg))
    .on('log-error', msg => logger.error(msg));

const accPackageJson = require('../acc/package.json');

export function activate(context: ExtensionContext) {

    logger.info(`ACC Details: `, {
        name: accPackageJson.name,
        author: accPackageJson.author,
        description: accPackageJson.description,
        version: accPackageJson.version,
        license: accPackageJson.license,
        repository: accPackageJson.repository.url
    });


    context.subscriptions.push(commands.registerCommand('f5.chariot.convert', async () => {

        logger.info(`f5.chariot.convert called`);

        await window.withProgress({
            location: ProgressLocation.Notification,
            title: `Converting with ACC`,
        }, async () => {

            await getText()
                .then(async text => {

                    logger.debug(`f5.chariot.convert text found`);

                    const { declaration, metaData } = await acc(text);

                    // display as3 output in editor
                    displayJsonInEditor(declaration);

                    // log all the metadata
                    logger.debug('ACC METADATA', metaData);
                })
                .catch(err => {
                    logger.error('f5.chariot.convert failed with', err);
                });
        });

    }));

}

