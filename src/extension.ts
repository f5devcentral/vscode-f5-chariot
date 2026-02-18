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
    displayJsonInEditor2,
    getEditorText
} from './util';

import Logger from 'f5-conx-core/dist/logger';

import * as tmos from 'tmos-converter';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const tmosPackageJson = require('tmos-converter/package.json');

const logger = new Logger('F5_CHARIOT_LOG_LEVEL');
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

export function activate(context: ExtensionContext) {

    // process.on('unhandledRejection', error => {
    // 	logger.error('--- unhandledRejection ---', error);
    // });


    // log core tmos-converter package details
    logger.info(`TMOS Converter Details: `, {
        name: tmosPackageJson.name,
        description: tmosPackageJson.description,
        version: tmosPackageJson.version,
        license: tmosPackageJson.license
    });

    context.subscriptions.push(commands.registerCommand('f5.chariot.convertAS3', async (editor) => {

        // make output visible
        f5OutputChannel.show();

        logger.info(`f5.chariot.convertAS3 called`);

        return await window.withProgress({
            location: ProgressLocation.Notification,
            title: `Converting to AS3`,
        }, async () => {

            return await getEditorText(editor)
                .then(async text => {

                    logger.info(`f5.chariot.convertAS3 text found`);

                    // standardize line returns to linux/mac
                    if (/\r\n/.test(text)) {
                        logger.info(`f5.chariot.convertAS3 converting "\\r\\n" to "\\n"`);
                        text = text.replace(/\r\n/g, '\n');
                    }

                    const result = await tmos.convertToAS3(text)
                        .catch((err: Error) => {
                            logger.error('TMOS conversion to AS3 failed with', err);
                            throw err;
                        });

                    const { declaration } = result;

                    // log conversion metadata
                    logger.info('AS3 Conversion Result', {
                        iappSupported: result.iappSupported,
                        unsupportedStats: result.unsupportedStats,
                        keyClassicNotSupported: result.keyClassicNotSupported
                    });

                    // display as3 output in editor
                    const convertedAs3editor = await displayJsonInEditor2(declaration);

                    try {
                        const a = await (await commands.getCommands(true)).filter( x => x === 'f5.injectSchemaRef');
                        commands.executeCommand('f5.injectSchemaRef');
                        logger.info('f5 atc schema injected');
                    } catch (e) {
                        logger.info('f5 atc schema injection failed', e);
                    }

                    return convertedAs3editor;
                })
                .catch(err => {
                    // log full error if we got one
                    logger.error('f5.chariot.convertAS3 failed with', err);
                });
        });

    }));


    context.subscriptions.push(commands.registerCommand('f5.chariot.convertDO', async (editor) => {

        // make output visible
        f5OutputChannel.show();

        logger.info(`f5.chariot.convertDO called`);

        return await window.withProgress({
            location: ProgressLocation.Notification,
            title: `Converting to DO`,
        }, async () => {

            return await getEditorText(editor)
                .then(async text => {

                    logger.info(`f5.chariot.convert text found`);

                    // standardize line returns to linux/mac
                    if (/\r\n/.test(text)) {
                        logger.info(`f5.chariot.convertDO converting "\\r\\n" to "\\n"`);
                        text = text.replace(/\r\n/g, '\n');
                    }

                    const result = tmos.convertToDO(text);

                    const { declaration } = result;

                    // log conversion result
                    logger.info('DO Conversion completed');

                    // display as3 output in editor
                    const convertedDo = await displayJsonInEditor2(declaration);
                    return convertedDo;
                })
                .catch(err => {
                    // log full error if we got one
                    logger.error('f5.chariot.convertDO failed with', err);
                });
        });

    }));

}

