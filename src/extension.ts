/*
 * Copyright 2020. F5 Networks, Inc. See End User License Agreement ("EULA") for
 * license terms. Notwithstanding anything to the contrary in the EULA, Licensee
 * may copy and modify this software product for its internal business purposes.
 * Further, Licensee may upload, publish and distribute the modified version of
 * the software product on devcentral.f5.com.
 */

'use strict';

// import * as fs from 'fs';
// import * as path from 'path';
import * as os from 'os';

// import * as cp from 'child_process';
// import ChildProcess = cp.ChildProcess;

// import * as Docker from 'dockerode';

import { ExtensionContext, commands, window, ProgressLocation, languages, Hover, TextDocument } from 'vscode';
// import { window, ExtensionContext, commands, workspace, Uri, ProgressLocation } from 'vscode';

import logger from './logger';
import { browseFile, displayJsonInEditor, getText } from './util';
import { Settings } from './settings';

import Http from './accHttp';
import { debug } from 'console';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const acc = require('f5-appsvcs-acc/src/accWrapper');

import accPackageJson = require('f5-appsvcs-acc/package.json');
import { parseX509 } from './x509';


export function activate(context: ExtensionContext) {

    logger.debug(`Host details: `, {
        hostOS: os.type(),
        platform: os.platform(),
        release: os.release(),
        userInfo: `${JSON.stringify(os.userInfo())}`
    });

    logger.debug(`ACC Details: `, {
        [accPackageJson.name]: accPackageJson.version
    });


    context.subscriptions.push(commands.registerCommand('f5.chariot.convertDirect', async () => {

        logger.debug(`f5.chariot.convertDirect called`);

        // await getText()
        // .then( text => {
        //     // const cert = new RegExp("(?m)^-{3,}BEGIN CERTIFICATE-{3,}$(?s).*?^-{3,}END CERTIFICATE-{3,}$", "g");
        //     const reg = /-{3,}BEGIN CERTIFICATE-{3,}[\s\S]+?-{3,}END CERTIFICATE-{3,}/;
        //     const cert = new RegExp(reg, "g");
        //     logger.debug(cert.test(text), text);
        //     logger.debug('parsed x509', parseX509(text));
        //     // logger.debug('parsed pretty  x509', jsYaml.safeDump(parseX509(text), { indent: 4 }));

        //     // provideHover() {

        //     //     return new Hover('asdf')
        //     // }
            
        // });

        window.withProgress({
            location: ProgressLocation.Notification,
            title: `Converting with ACC`,
        }, async () => {

            await getText()
                .then(async text => {

                    logger.debug(`f5.chariot.convertDirect text found`);

                    const { declaration, metaData } = await acc(text);
                    // display as3 output in editor
                    displayJsonInEditor(declaration);
                    // log all the metadata
                    logger.debug('ACC METADATA', metaData);
                })
                .catch(err => {
                    logger.error('f5.chariot.convertDirect failed with', err);
                });
        });

    }));


    // const http = new Http();

    // const extSettings = new Settings(context);

    // const docker = new Docker({ socketPath: '/var/run/docker.sock' });

    // workspace.onDidChangeConfiguration( x => {
    //     logger.debug('EXTENSION CONFIGURATION CHANGED!!!');
    //     extSettings.loadConfig(x);
    // });


    // context.subscriptions.push(commands.registerCommand('f5.chariot.importImage', async (item) => {
    //     // browse for acc image to import to docker

    //     let filePath: string;

    // 	if (!item) {
    // 		// no input means we need to browse for a local file
    //         await browseFile()
    //         .then( file => item = file)
    //         .catch( err => {
    //             logger.debug(`f5.chariot.import: image browse failed`, err);
    //         });
    // 	}

    // 	if (item?._fsPath) {

    // 		logger.debug(`f5.chariot.importImage _fsPath recieved:`, item._fsPath);
    // 		filePath = item._fsPath;

    // 	} else if (item?.path) {

    // 		logger.debug(`f5.chariot.importImage path revieved:`, item.path);
    // 		filePath = item.path;

    // 	} else {

    // 		return logger.error('f5.chariot.importImage -> Neither path supplied was valid', JSON.stringify(item));

    // 	}

    //     const fileStream = fs.createReadStream(filePath);

    //     await docker.loadImage(fileStream)
    //     .then( resp => {

    //         // look into listing images to confirm it imported
    //         // or look into setting this image as the default

    //         // there doesn't seem to be a quick way to identify exactly which image was imported, so we can set it as the default in the config

    //         // path/file input fed to loadImage function
    //         // '/home/ted/projects/chariot_support/f5-appsvcs-acc-1.10.0.tar.gz'

    //         // output from the list images
    //         // [2021-02-25T17:25:51.300Z] DEBUG: f5.chario.selectImage: docker images on system:  [
    //         //     'f5-appsvcs-acc:1.10.0',
    //         //     'vinnie357/f5-devops-airgap:coder',
    //         //     'f5-appsvcs-charon:1.9.0',
    //         //     'f5devcentral/containthedocs:latest',
    //         //     'f5-appsvcs-charon:1.8.0',
    //         //     'hello-world:latest'
    //         //   ]
    //         //   [2021-02-25T17:25:51.300Z] DEBUG: f5.chariot.selectImage: ACC docker images found:  [
    //         //     'f5-appsvcs-acc:1.10.0',
    //         //     'f5-appsvcs-charon:1.9.0',
    //         //     'f5-appsvcs-charon:1.8.0'
    //         //   ]

    //         // this was going to save the newly imported image as the image to be used in the extension
    //         // workspace.getConfiguration().update('f5.chariot.image', resp);

    //         return;
    //     })
    //     .catch(err => {
    //         logger.debug(`f5.chariot.import: image import failed`, err);
    //     });


    // }));








    // context.subscriptions.push(commands.registerCommand('f5.chariot.convertAPI', async () => {
    //     // convert configuration over API enpoint


    //     // docker pull vzhuravlevf5/zvvaccdev:dev
    //     // docker run --rm -v "$PWD":/app/data -p 8080:8080 vzhuravlevf5/zvvaccdev:dev serve
    //     // curl -v http://localhost:8080/as3convert --form "conf=@/Users/dittmer/Desktop/toConvert.conf

    //     await getText()
    //     .then( async text => {
    //         const x = text;
    //         await http.post(text)
    //         .then( resp => {
    //             const b = resp;
    //         });
    //     })
    //     .catch( err => {
    //         logger.error('f5.chariot.convertAPI failed with', err);
    //     });

    // }));





    // context.subscriptions.push(commands.registerCommand('f5.chariot.convert', async () => {

    //     window.withProgress({
    //         location: ProgressLocation.Notification,
    //         title: `Converting with ACC`,
    //         cancellable: true
    //     }, async () => {

    //         const extPath = path.join(__dirname, '..');
    //         let wkspce = workspace.rootPath;
    //         const image = workspace.getConfiguration().get('f5.chariot.dockerImage', 'f5-appsvcs-charron:1.8.0');
    //         const outputFile = workspace.getConfiguration().get('f5.chariot.outFileName', 'converted.as3.json');
    //         const fullCmd = workspace.getConfiguration().get('f5.chariot.fullCommand', '');

    //         await logger.makeVisible();   // make log OUTPUT visible again...

    //         logger.debug(`Host OS: ${os.type()}, Platform: ${os.platform()}, Release: ${os.release()}, UserInfo: ${JSON.stringify(os.userInfo())}`);

    //         // get editor window
    //         const editor = window.activeTextEditor;
    //         if (!editor) {
    //             logger.error('no open editor - exiting');
    //             return;
    //         }
    //         if (!wkspce) {
    //             // if no open workspace, should make the user open a workspace,
    //             // but for now we just fallback to using the extension path
    //             wkspce = extPath;
    //             logger.debug(`no open workspace detected, will try to place files in extension base path`);
    //         } else {
    //             logger.debug(`detected open vscode workspace of ${wkspce}, will use this workspace for files location`);
    //         }

    //         // capture selected text or all text in editor
    //         let text: string;
    //         if (editor.selection.isEmpty) {
    //             text = editor.document.getText();	// entire editor/doc window
    //             logger.debug('got entire editor text');
    //         } else {
    //             text = editor.document.getText(editor.selection);	// highlighted text
    //             logger.debug('got selected text in editor');
    //         }

    //         const inputFile = 'toConvert.conf';
    //         const inputFilePath = path.join(wkspce, inputFile);
    //         const outputFilePath = path.join(wkspce, outputFile);

    //         fs.writeFileSync(inputFilePath, text);
    //         logger.debug('writing text to file: ', inputFilePath);

    //         // build/append docker command
    //         let rund = `docker run --rm -v `;                   // base docker command
    //         rund += `${wkspce}:/app/data `;                     // volume mount
    //         rund += `${image} `;                                // image definition
    //         rund += `-o data/${outputFile} `;                   // output file definition
    //         rund += `-c data/${inputFile} `;                    // input file definition
    //         rund += `--unsupported `;                           // logs configuration objects that ACC did notconvert
    //         rund += `--unsupported-objects unSupported.json`;   // logs to file objects not converted

    //         // overwrite above string if we have fullCmd from settings
    //         rund = fullCmd ? fullCmd : rund;

    //         // remove any escaped "
    //         rund = rund.replace(/(\\"|\\\\")/g, '"');

    //         logger.debug('Issuing docker command: ', rund);
    //         await new Promise(r => setTimeout(r, 500));

    //         text = text.replace(/\r\n/g, '\n');

    //         try {

    //             // try to execute command and display the results in an editor
    //             const resp4 = cp.execSync(rund).toString();

    //             await new Promise(r => setTimeout(r, 500));

    //             logger.debug(`Process complete, output: \n\n${resp4}`);
    //             logger.debug('Opening output file: ', outputFilePath);

    //             const openPath = Uri.parse(outputFilePath);

    //             workspace.openTextDocument(openPath)
    //                 .then(doc => {
    //                     window.showTextDocument(doc);
    //                 });

    //         } catch (e) {
    //             // catch all errors from command execution
    //             logger.debug(`Docker command failed, output,`, e);
    //         }


    //         // todo: delete files when done, converted.as3.json and unSupported.json
    //     });
    // }));

    // context.subscriptions.push(commands.registerCommand('f5.chariot.selectImage', async () => {

    //     /**
    //      * get list of local docker images
    //      * setup quickPick with imageName:version
    //      * set configuration with choice to be used for next conversion
    //      */
    //     logger.debug('f5.chariot.selectImage');



    //     const accImages = await docker.listImages()
    //     .then(list => {
    //         const dockerImages = list.map(el => el.RepoTags.join('-'));
    //         logger.debug('f5.chario.selectImage: docker images on system: ', dockerImages);
    //         return dockerImages.filter(x => x.includes('f5-appsvcs-'));
    //     });

    //     logger.debug('f5.chariot.selectImage: ACC docker images found: ', accImages);

    //     await window.showQuickPick(accImages)
    //     .then( image => {
    //         logger.debug('f5.chariot.selectImage: ACC docker image selected: ', image);
    //         // workspace.getConfiguration().get('f5.chariot.dockerImage', 'f5-appsvcs-charron:1.8.0');
    //         workspace.getConfiguration().update('f5.chariot.dockerImage', image);
    //         // workspace.getConfiguration().
    //     });

    //     logger.debug('f5.chariot.selectImage: done ');

    // }));





    // context.subscriptions.push(commands.registerCommand('f5.chariot.settings', () => {
    //     //	open settings window and bring the user to the F5 section
    //     return commands.executeCommand("workbench.action.openSettings", "f5-chariot");
    // }));



}


// async function detectDocker() {

//     // function to detect if docker is actually running 
//     // was gonna just look for a response to the following
//     // curl --unix-socket /var/run/docker.sock http:/v1.24/images/json
// }


// /**
//  * Executes a shell command and return it as a Promise.
//  * ** long way to run a shell command async, or just use execSync...
//  * @param cmd 
//  * @return
//  */
// async function execShellCommand(cmd: string): Promise<string> {
//     // const exec = require('child_process').exec;
//     return new Promise((resolve, reject) => {
//         cp.exec(cmd, (error, stdout, stderr) => {
//             if (error) {
//                 console.warn(error);
//             }
//             resolve(stdout ? stdout : stderr);
//         });
//     });
// }