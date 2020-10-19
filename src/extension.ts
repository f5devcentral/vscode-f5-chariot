
import * as fs from 'fs';
import * as path from 'path';
import * as cp from 'child_process';
import ChildProcess = cp.ChildProcess;

import { window, ExtensionContext, commands, Terminal, workspace, Uri } from 'vscode';

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

let term: Terminal | undefined;
export function activate(context: ExtensionContext) {

    const disposable = commands.registerCommand('f5.chariot.convert', async () => {
        // window.showInformationMessage('Hello World!');

        const extPath = path.join(__dirname, '../');
        const terms = window.terminals;
        const wkspc = workspace;
        let wk2 = workspace.rootPath
        const wk3 = workspace.workspaceFolders;
        const wkspcFldr = workspace.getConfiguration();
        const image = workspace.getConfiguration().get('f5.chariot.dockerImage', 'f5-appsvcs-charron:1.7.0');
        const outputFile = workspace.getConfiguration().get('f5.chariot.outFileName', 'converted.as3.json');

        //curl -s --unix-socket /var/run/docker.sock http://dummy/containers/json
        //curl --unix-socket /var/run/docker.sock http:/v1.24/images/json

        // get editor window
		const editor = window.activeTextEditor;
		if (!editor) {
            console.log('no open editor - exiting');
			return;
        }
        if (!wk2) {
            // if no open workspace, should make the user open a workspace,
            // but for now we just fallback to using the extension path
            wk2 = extPath;
        }

		// capture selected text or all text in editor
		let text: string;
		if (editor.selection.isEmpty) {
			text = editor.document.getText();	// entire editor/doc window
		} else {
			text = editor.document.getText(editor.selection);	// highlighted text
        } 
        const inputFile = 'toConvert.conf';
        // const outputFile = 'converted.as3.json';
        const inputFilePath = path.join(wk2, inputFile)
        const outputFilePath = path.join(wk2, outputFile)
        fs.writeFileSync(inputFilePath, text)

        // const listImages = `curl --unix-socket /var/run/docker.sock http:/v1.40/images/json`
        // const exp = cp.exec(listImages, (err, stdout, stderr) => {
        //     if (err) {
        //         return console.log('error: ' + err);
        //     }
        //     console.log('stdout: ' + stdout);
        //     return [stdout, stderr];
        //     console.log('stderr: ' + stderr);
        // });
        // let images;
        // try {
        //     images = cp.execSync('docker image ls').toString();
        // } catch (e) {
        //     console.error(e.message);
        //     console.log('tried to get docker images failed, might need sudo')
        //     // const m = e.message.includes('permission denied')
        //     // if (e.message.includes('permission denied')) {
        //     //     return window.showErrorMessage('not able to read current docker images (permission denied)\n, https://docs.docker.com/engine/install/linux-postinstall/')
        //     // }
        //     try {
        //         const fix1 = cp.execSync('sudo docker image ls').toString();
        //     } catch (e) {
        //         console.error(e.message)
        //         console.log('listing docker images with sudo failed, is docker installed?')
        //     }
            
        // }

        // confirm docker is installed
        // try a "docker --version" command?
        //   -- or --
        // 'docker image ls' to select the image to use for conversion, "if" that image variable is not set yet

        // if we don't already have a terminal, create one
        // if (!term) {
        //     term = window.createTerminal('f5-chariot'); 
        // }
        // term.show(true);

        const rund = `docker run --rm -v ${wk2}:/app/data ${image} -o data/${outputFile} -c data/${inputFile}`;

        // term.sendText(rund)

        // const resp3 = await execShellCommand(rund);
        const resp4 = cp.execSync(rund).toString();
        console.log('container executed, output: \n', resp4)

        // window.termin     .onDidWriteTerminalData((e) => {console.log(e.data)})

        // const cmd = `docker run --rm -v "$PWD":/app/data f5-appsvcs-charon:1.0.0 -o data/<output-file-name>.json -c data/${outputFile}`;
        // term.sendText(cmd);

        const openPath = Uri.parse("file:///" + outputFilePath); //A request file path
        workspace.openTextDocument(openPath).then(doc => {
            window.showTextDocument(doc);
        });
	});

	context.subscriptions.push(disposable);
}


/**
 * Executes a shell command and return it as a Promise.
 * @param cmd 
 * @return
 */
async function execShellCommand(cmd: string):Promise<string> {
    // const exec = require('child_process').exec;
    return new Promise((resolve, reject) => {
     cp.exec(cmd, (error, stdout, stderr) => {
      if (error) {
       console.warn(error);
      }
      resolve(stdout? stdout : stderr);
     });
    });
   }