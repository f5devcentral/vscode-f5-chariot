/*
 * Copyright 2020. F5 Networks, Inc. See End User License Agreement ("EULA") for
 * license terms. Notwithstanding anything to the contrary in the EULA, Licensee
 * may copy and modify this software product for its internal business purposes.
 * Further, Licensee may upload, publish and distribute the modified version of
 * the software product on devcentral.f5.com.
 */

'use strict';

import { 
    ExtensionContext,
    commands,
    window,
    ProgressLocation
} from 'vscode';

import logger from './logger';
import { 
    displayJsonInEditor,
    getText
} from './util';

const acc = require('../acc/src/accWrapper');

const accPackageJson = require('../acc/package.json');


export function activate(context: ExtensionContext) {

    logger.debug(`ACC Details: `, {
        [accPackageJson.name]: accPackageJson.version
    });


    context.subscriptions.push(commands.registerCommand('f5.chariot.convert', async () => {

        logger.debug(`f5.chariot.convert called`);

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

