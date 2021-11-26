import * as assert from 'assert';
import fs = require('fs');
import path = require('path');
import { beforeEach } from 'mocha';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import { Uri, window, commands, workspace, TextDocument } from 'vscode';
import { cleanUniques, getText, requireText } from '../../util';

// test file/path
const testAppConf = path.join(__dirname, '..', '..', '..', 'artifacts', 'testApp.conf');
const testAppAS3 = path.join(__dirname, '..', '..', '..', 'artifacts', 'testApp.as3.json');
const testDoConf = path.join(__dirname, '..', '..', '..', 'artifacts', 'base_do.conf');
const testDo = path.join(__dirname, '..', '..', '..', 'artifacts', 'base.do.json');
// src/tests/artifacts/testApp.conf

const testAppText = requireText(testAppConf);
const testAppJson = requireText(testAppAS3);
const testAppParsed = Uri.file(testAppConf);

const testDoText = requireText(testDoConf);
const testDoJson = requireText(testDo);
const testDoParsed = Uri.file(testDoConf);

// flag to step through tests for debugging
// eslint-disable-next-line prefer-const
let step = false;
// step = true;
let testTitle: string;

suite('Core acc-chariot tests', () => {
	window.showInformationMessage('Starting main tests');
	// beforeEach( function () {
	// 	// await new Promise(f => setTimeout(f, 2000));

	// 	setTimeout(() => console.log("clearing"), 2000);

	// 	//	clear all open editors
	// 	commands.executeCommand('workbench.action.closeAllEditors');

	// 	setTimeout(() => console.log("clearing"), 2000);
	// 	// return await new Promise(f => setTimeout(f, 2000));

	// });

	test('clearing all editors', async () => {

		await new Promise(f => setTimeout(f, 2000));
		//	clear all open editors
		await commands.executeCommand('workbench.action.closeAllEditors');

		await new Promise(f => setTimeout(f, 2000));

	}).timeout(5000);


	test('open test tmos app config', async () => {

		// open a new text editor
		return await workspace.openTextDocument(testAppParsed)
			.then(async doc => {
				//	show new text editor (make active)
				await window.showTextDocument(doc);
				// return doc;
				await new Promise(f => setTimeout(f, 2000));

				return await getText(doc)
					.then(async text => {
						if (step) await window.showWarningMessage(testTitle, 'continue?');
						return assert.deepStrictEqual(text, testAppText);
					})
					.catch(async err => {
						console.error(err);
						// pop up a prompt to show the error and allow for dev troubleshooting
						// return await window.showWarningMessage(`ERROR: ${err}`, 'continue?');
					});
			});




	}).timeout(50000);

	testTitle = 'convert test app tmos to as3 with acc';
	test(testTitle, async () => {

		// execute acc to pick up editor text and convert it
		const editor = await commands.executeCommand('f5.chariot.convertAS3') as TextDocument;

		// const a = window.activeTextEditor;
		await window.showTextDocument(editor.uri);

		await new Promise(f => setTimeout(f, 2000));

		await getText()
			.then(async text => {
				const editorText = await cleanUniques(JSON.parse(text));
				const original = await cleanUniques(JSON.parse(testAppJson));
				if (step) await window.showWarningMessage(testTitle, 'continue?');
				assert.deepStrictEqual(editorText, original);
			})
			.catch(async err => {
				console.error(err);
				// pop up a prompt to show the error and allow for dev troubleshooting
				// await window.showWarningMessage(err, 'continue?');
			});


	}).timeout(50000);

	test('clearing all editors', async () => {

		await new Promise(f => setTimeout(f, 2000));
		//	clear all open editors
		await commands.executeCommand('workbench.action.closeAllEditors');

		await new Promise(f => setTimeout(f, 2000));

	}).timeout(5000);

	testTitle = 'convert test app tmos to DO with acc';
	test(testTitle, async () => {

		// open a new text editor
		await workspace.openTextDocument(testDoParsed)
			.then(async doc => {
				//	show new text editor (make active)
				await window.showTextDocument(doc);
				// return doc;
			});

		await new Promise(f => setTimeout(f, 2000));

		// execute acc to pick up editor text and convert it
		const editor = await commands.executeCommand('f5.chariot.convertDO') as TextDocument;

		// const a = window.activeTextEditor;
		await window.showTextDocument(editor.uri);

		await new Promise(f => setTimeout(f, 2000));

		await getText()
			.then(async text => {
				const editorText = await cleanUniques(JSON.parse(text));
				const original = await cleanUniques(JSON.parse(testDoJson));
				if (step) await window.showWarningMessage(testTitle, 'continue?');
				assert.deepStrictEqual(editorText, original);
			})
			.catch(async err => {
				console.error(err);
				// pop up a prompt to show the error and allow for dev troubleshooting
				// await window.showWarningMessage(err, 'continue?');
			});


	}).timeout(50000);

	test('clearing all editors', async () => {

		await new Promise(f => setTimeout(f, 2000));
		//	clear all open editors
		await commands.executeCommand('workbench.action.closeAllEditors');

		await new Promise(f => setTimeout(f, 2000));

	}).timeout(5000);
});
