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

import { EventEmitter } from 'events';

// import main acc function (no TS types available at this time)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const main = require('f5-as3-config-converter/src/main');

const logger = Logger.getLogger();
logger.console = false;

// create OUTPUT channel
const f5OutputChannel = window.createOutputChannel('f5-chariot');
// there is no way to get the output channel id of the main vscode-f5 extension, so we can't just output there
//  https://stackoverflow.com/questions/59597290/get-vscode-output-channel
// So, we create a new channel and make it visible for each conversion

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

// import package details for logging
// eslint-disable-next-line @typescript-eslint/no-var-requires
const accPackageJson = require('f5-as3-config-converter/package.json');

export function activate(context: ExtensionContext) {

    // log core acc package details
    logger.info(`ACC Details: `, {
        name: accPackageJson.name,
        author: accPackageJson.author,
        description: accPackageJson.description,
        version: accPackageJson.version,
        license: accPackageJson.license,
        repository: accPackageJson.repository.url
    });


    context.subscriptions.push(commands.registerCommand('f5.chariot.convert', async () => {

        // make output visible
        f5OutputChannel.show();

        logger.info(`f5.chariot.convert called`);

        return await window.withProgress({
            location: ProgressLocation.Notification,
            title: `Converting with ACC`,
        }, async () => {

            return await getText()
                .then(async text => {

                    logger.info(`f5.chariot.convert text found`);
                    
                    // standardize line returns to linux/mac
                    if (/\r\n/.test(text)) {
                        logger.info(`f5.chariot.convert converting "\\r\\n" to "\\n"`);
                        text = text.replace(/\r\n/g, '\n');
                    }

                    // const { declaration, metaData } = await acc(text);
                    const { declaration, metaData } = await main.mainAPI(text);

                    // log all the metadata
                    logger.info('ACC METADATA', metaData);
                    
                    // display as3 output in editor
                    return displayJsonInEditor(declaration);
                })
                .catch(err => {
                    // log full error if we got one
                    logger.error('f5.chariot.convert failed with', err);
                });
        });

    }));

}

