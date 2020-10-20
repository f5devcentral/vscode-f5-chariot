
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as cp from 'child_process';
import ChildProcess = cp.ChildProcess;

import { window, ExtensionContext, commands, workspace, Uri } from 'vscode';

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

        const extPath = path.join(__dirname, '../');
        let wkspce = workspace.rootPath;
        const image = workspace.getConfiguration().get('f5.chariot.dockerImage', 'f5-appsvcs-charron:1.7.0');
        const outputFile = workspace.getConfiguration().get('f5.chariot.outFileName', 'converted.as3.json');

        logger.makeVisible();   // make log OUTPUT visible again...

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
        logger.debug('Issuing docker command: ', rund);

        const resp4 = cp.execSync(rund).toString();
        logger.debug(`Process complete, output: \n\n${resp4}`);

        logger.debug('Opening output file: ', outputFilePath);
        const openPath = Uri.parse(outputFilePath);
        workspace.openTextDocument(openPath).then(doc => {
            window.showTextDocument(doc);
        });
    }));

    context.subscriptions.push(commands.registerCommand('f5.chariot.selectImage', async () => {

        /**
         * get list of local docker images
         * setup quickPick with imageName:version
         * set configuration with choice to be used for next conversion
         */

        //curl -s --unix-socket /var/run/docker.sock http://dummy/containers/json
        //curl --unix-socket /var/run/docker.sock http:/v1.24/images/json

        // the following unix-socket commands provide json output that is easily parsed
        const listImages = `curl --unix-socket /var/run/docker.sock http:/v1.40/images/json`;
        const exp = cp.exec(listImages, (err, stdout, stderr) => {
            if (err) {
                return logger.error('exec error', err);
            }
            // console.log('stdout: ' + stdout);
            logger.error('exec stderr: ', stderr);
            return [stdout, stderr];
        });
        let images;
        try {
            images = cp.execSync(listImages).toString();
        } catch (e) {
            console.error(e.message);
            console.log('tried to get docker images failed, might need sudo');
            // const m = e.message.includes('permission denied')
            // if (e.message.includes('permission denied')) {
            //     return window.showErrorMessage('not able to read current docker images (permission denied)\n, https://docs.docker.com/engine/install/linux-postinstall/')
            // }
            try {
                const fix1 = cp.execSync('sudo docker image ls').toString();
            } catch (e) {
                console.error(e.message);
                console.log('listing docker images with sudo failed, is docker installed?');
            }

        }
    }));

    context.subscriptions.push(commands.registerCommand('f5.chariot.settings', () => {
		//	open settings window and bring the user to the F5 section
		return commands.executeCommand("workbench.action.openSettings", "f5-chariot");
	}));

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