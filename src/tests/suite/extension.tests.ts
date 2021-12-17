import * as assert from 'assert';
import fs = require('fs');
import path = require('path');

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import { Uri, window, commands, workspace, TextDocument } from 'vscode';
import { cleanUniques, getEditorText, requireText } from '../../util';

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
// step = true;
let testTitle: string;

suite('Core acc-chariot tests', () => {
	window.showInformationMessage('Starting main tests');

	test('clearing all editors', async () => {

		//	clear all open editors
		return await commands.executeCommand('workbench.action.closeAllEditors');

	}).timeout(5000);

	test('convert test app tmos to as3 with acc', async () => {

		// open a new text editor
		const appConfigEditor = await workspace.openTextDocument(testAppParsed)
		.then(async doc => {
			//	show new text editor (make active)
			await window.showTextDocument(doc);
			return doc;
		});

		// execute acc to pick up editor text and convert it
		const editor = await commands.executeCommand('f5.chariot.convertAS3', appConfigEditor) as TextDocument;

		await window.showTextDocument(editor.uri);

		// get converted text
		const converted = editor.getText();

		const editorText = await cleanUniques(JSON.parse(converted));
		const original = await cleanUniques(JSON.parse(testAppJson));
		assert.deepStrictEqual(editorText, original);

	}).timeout(50000);

	test('clearing all editors', async () => {

		//	clear all open editors
		await commands.executeCommand('workbench.action.closeAllEditors');

	}).timeout(5000);



	test('convert test app tmos to DO with acc', async () => {

		// open a new text editor
		const baseConfigEditor = await workspace.openTextDocument(testDoParsed)
			.then(async doc => {
				//	show new text editor (make active)
				await window.showTextDocument(doc);
				return doc;
			});

		// execute acc to pick up editor text and convert it
		const editor = await commands.executeCommand('f5.chariot.convertDO', baseConfigEditor) as TextDocument;

		// get converted text
		const converted = editor.getText();

		const editorText = await cleanUniques(JSON.parse(converted));
		const original = await cleanUniques(JSON.parse(testDoJson));
		assert.deepStrictEqual(editorText, original);

	}).timeout(50000);

	test('clearing all editors', async () => {

		//	clear all open editors
		await commands.executeCommand('workbench.action.closeAllEditors');

	}).timeout(5000);
});
