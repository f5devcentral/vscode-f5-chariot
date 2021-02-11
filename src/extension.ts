/*
 * Copyright 2020. F5 Networks, Inc. See End User License Agreement ("EULA") for
 * license terms. Notwithstanding anything to the contrary in the EULA, Licensee
 * may copy and modify this software product for its internal business purposes.
 * Further, Licensee may upload, publish and distribute the modified version of
 * the software product on devcentral.f5.com.
 */

'use strict';

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as cp from 'child_process';
import ChildProcess = cp.ChildProcess;

import * as Docker from 'dockerode';

import { window, ExtensionContext, commands, workspace, Uri, ProgressLocation } from 'vscode';

import logger from './logger';

/**
 * 
 * 1. get editor text (whole document or whatever is highlighted)
 * 2. put text in file
 * 3. run converter
 * 4. get output file -> display in new editor
 * 
 * https://stackoverflow.com/questions/7055061/nodejs-temporary-file-name
 * 
 */

export function activate(context: ExtensionContext) {



    context.subscriptions.push(commands.registerCommand('f5.chariot.convert', async () => {

        window.withProgress({
            location: ProgressLocation.Notification,
            title: `Converting with ACC`,
            cancellable: true
        }, async () => {

            const extPath = path.join(__dirname, '..');
            let wkspce = workspace.rootPath;
            const image = workspace.getConfiguration().get('f5.chariot.dockerImage', 'f5-appsvcs-charron:1.8.0');
            const outputFile = workspace.getConfiguration().get('f5.chariot.outFileName', 'converted.as3.json');
            const fullCmd = workspace.getConfiguration().get('f5.chariot.fullCommand', '');

            await logger.makeVisible();   // make log OUTPUT visible again...

            logger.debug(`Host OS: ${os.type()}, Platform: ${os.platform()}, Release: ${os.release()}, UserInfo: ${JSON.stringify(os.userInfo())}`);

            // get editor window
            const editor = window.activeTextEditor;
            if (!editor) {
                logger.error('no open editor - exiting');
                return;
            }
            if (!wkspce) {
                // if no open workspace, should make the user open a workspace,
                // but for now we just fallback to using the extension path
                wkspce = extPath;
                logger.debug(`no open workspace detected, will try to place files in extension base path`);
            } else {
                logger.debug(`detected open vscode workspace of ${wkspce}, will use this workspace for files location`);
            }

            // capture selected text or all text in editor
            let text: string;
            if (editor.selection.isEmpty) {
                text = editor.document.getText();	// entire editor/doc window
                logger.debug('got entire editor text');
            } else {
                text = editor.document.getText(editor.selection);	// highlighted text
                logger.debug('got selected text in editor');
            }

            const inputFile = 'toConvert.conf';
            const inputFilePath = path.join(wkspce, inputFile);
            const outputFilePath = path.join(wkspce, outputFile);

            fs.writeFileSync(inputFilePath, text);
            logger.debug('writing text to file: ', inputFilePath);

            // build/append docker command
            let rund = `docker run --rm -v `;                   // base docker command
            rund += `${wkspce}:/app/data `;                     // volume mount
            rund += `${image} `;                                // image definition
            rund += `-o data/${outputFile} `;                   // output file definition
            rund += `-c data/${inputFile} `;                    // input file definition
            rund += `--unsupported `;                           // logs configuration objects that ACC did notconvert
            rund += `--unsupported-objects unSupported.json`;   // logs to file objects not converted

            // overwrite above string if we have fullCmd from settings
            rund = fullCmd ? fullCmd : rund;

            // remove any escaped "
            rund = rund.replace(/(\\"|\\\\")/g, '"');

            logger.debug('Issuing docker command: ', rund);
            await new Promise(r => setTimeout(r, 500));

            try {

                // try to execute command and display the results in an editor
                const resp4 = cp.execSync(rund).toString();

                await new Promise(r => setTimeout(r, 500));

                logger.debug(`Process complete, output: \n\n${resp4}`);
                logger.debug('Opening output file: ', outputFilePath);

                const openPath = Uri.parse(outputFilePath);

                workspace.openTextDocument(openPath)
                    .then(doc => {
                        window.showTextDocument(doc);
                    });

            } catch (e) {
                // catch all errors from command execution
                logger.debug(`Docker command failed, output,`, e);
            }


            // todo: delete files when done, converted.as3.json and unSupported.json
        });
    }));

    context.subscriptions.push(commands.registerCommand('f5.chariot.selectImage', async () => {

        /**
         * get list of local docker images
         * setup quickPick with imageName:version
         * set configuration with choice to be used for next conversion
         */
        logger.debug('f5.chariot.selectImage');
        
        const docker = new Docker({ socketPath: '/var/run/docker.sock' });
        
        const accImages = await docker.listImages()
        .then(list => {
            const dockerImages = list.map(el => el.RepoTags.join('-'));
            logger.debug('f5.chario.selectImage: docker images on system: ', dockerImages);
            return dockerImages.filter(x => x.includes('f5-appsvcs'));
        });
        
        logger.debug('f5.chariot.selectImage: ACC docker images found: ', accImages);
        
        await window.showQuickPick(accImages)
        .then( image => {
            logger.debug('f5.chariot.selectImage: ACC docker image selected: ', image);
            // workspace.getConfiguration().get('f5.chariot.dockerImage', 'f5-appsvcs-charron:1.8.0');
            workspace.getConfiguration().update('f5.chariot.dockerImage', image);
            // workspace.getConfiguration().
        });
        
        logger.debug('f5.chariot.selectImage: done ');
        
    }));

    context.subscriptions.push(commands.registerCommand('f5.chariot.settings', () => {
        //	open settings window and bring the user to the F5 section
        return commands.executeCommand("workbench.action.openSettings", "f5-chariot");
    }));



}


async function detectDocker() {

    // function to detect if docker is actually running 
    // was gonna just look for a response to the following
    // curl --unix-socket /var/run/docker.sock http:/v1.24/images/json
}


/**
 * Executes a shell command and return it as a Promise.
 * ** long way to run a shell command async, or just use execSync...
 * @param cmd 
 * @return
 */
async function execShellCommand(cmd: string): Promise<string> {
    // const exec = require('child_process').exec;
    return new Promise((resolve, reject) => {
        cp.exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.warn(error);
            }
            resolve(stdout ? stdout : stderr);
        });
    });
}