import * as assert from 'assert';
import { isObject } from 'f5-conx-core';
import fs = require('fs');
import path = require('path');

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import { Uri, window, commands, workspace, TextDocument } from 'vscode';
import { cleanUniques, getEditorText, requireText } from '../../util';
import { log } from './index';

log('=== EXTENSION TESTS LOADING ===');

// test file/path
const testAppConf = path.join(__dirname, '..', '..', '..', 'artifacts', 'testApp.conf');
const testAppAS3 = path.join(__dirname, '..', '..', '..', 'artifacts', 'testApp.as3.json');
const testDoConf = path.join(__dirname, '..', '..', '..', 'artifacts', 'base_do.conf');
const testDo = path.join(__dirname, '..', '..', '..', 'artifacts', 'base.do.json');
// src/tests/artifacts/testApp.conf

log('Test file paths:');
log('  testAppConf:', testAppConf);
log('  testAppAS3:', testAppAS3);
log('  testDoConf:', testDoConf);
log('  testDo:', testDo);

const testAppText = requireText(testAppConf);
const testAppJson = requireText(testAppAS3);
const testAppParsed = Uri.file(testAppConf);

const testDoText = requireText(testDoConf);
const testDoJson = requireText(testDo);
const testDoParsed = Uri.file(testDoConf);

log('Test files loaded successfully');

// flag to step through tests for debugging
// eslint-disable-next-line prefer-const
// step = true;
let testTitle: string;

suite('Core acc-chariot tests', () => {
	log('=== SUITE STARTING ===');
	window.showInformationMessage('Starting main tests');

	test('clearing all editors', async () => {
		log('[TEST] clearing all editors - START');
		//	clear all open editors
		await commands.executeCommand('workbench.action.closeAllEditors');
		log('[TEST] clearing all editors - DONE');
	}).timeout(5000);

	test('convert test app tmos to as3 with acc', async () => {
		log('[TEST] convert AS3 - START');

		// open a new text editor
		log('[TEST] Opening test file:', testAppParsed.fsPath);
		const appConfigEditor = await workspace.openTextDocument(testAppParsed)
		.then(async doc => {
			log('[TEST] Document opened, showing in editor');
			//	show new text editor (make active)
			await window.showTextDocument(doc);
			return doc;
		});
		log('[TEST] Editor ready, document length:', appConfigEditor.getText().length);

		// execute acc to pick up editor text and convert it
		log('[TEST] Executing f5.chariot.convertAS3 command...');
		const editor = await commands.executeCommand('f5.chariot.convertAS3', appConfigEditor) as TextDocument;
		log('[TEST] Command completed, editor returned:', !!editor);

		if (!editor) {
			log('[TEST] ERROR: No editor returned from convertAS3 command!');
			throw new Error('No editor returned from convertAS3 command');
		}

		await window.showTextDocument(editor.uri);

		// get converted text
		const converted = editor.getText();
		log('[TEST] Converted text length:', converted.length);
		log('[TEST] Converted text (full):', converted);

		const editorText = await cleanUniques(JSON.parse(converted));
		const original = await cleanUniques(JSON.parse(testAppJson));
		log('[TEST] COMPARING:');
		log('[TEST] Actual:', editorText);
		log('[TEST] Expected:', original);

		assert.deepStrictEqual(editorText, original);
		assert.ok(editorText.class === 'ADC');
		log('[TEST] convert AS3 - PASSED');

	}).timeout(50000);

	test('clearing all editors 2', async () => {
		log('[TEST] clearing all editors 2 - START');
		//	clear all open editors
		await commands.executeCommand('workbench.action.closeAllEditors');
		log('[TEST] clearing all editors 2 - DONE');
	}).timeout(5000);



	test('convert test app tmos to DO with acc', async () => {
		log('[TEST] convert DO - START');

		// open a new text editor
		log('[TEST] Opening DO test file:', testDoParsed.fsPath);
		const baseConfigEditor = await workspace.openTextDocument(testDoParsed)
			.then(async doc => {
				log('[TEST] DO Document opened, showing in editor');
				//	show new text editor (make active)
				await window.showTextDocument(doc);
				return doc;
			});
		log('[TEST] DO Editor ready, document length:', baseConfigEditor.getText().length);

		// execute acc to pick up editor text and convert it
		log('[TEST] Executing f5.chariot.convertDO command...');
		const editor = await commands.executeCommand('f5.chariot.convertDO', baseConfigEditor) as TextDocument;
		log('[TEST] DO Command completed, editor returned:', !!editor);

		if (!editor) {
			log('[TEST] ERROR: No editor returned from convertDO command!');
			throw new Error('No editor returned from convertDO command');
		}

		// get converted text
		const converted = editor.getText();
		log('[TEST] DO Converted text length:', converted.length);
		log('[TEST] DO Converted text (full):', converted);

		const editorText = await cleanUniques(JSON.parse(converted));
		const original = await cleanUniques(JSON.parse(testDoJson));
		log('[TEST] DO COMPARING:');
		log('[TEST] DO Actual:', editorText);
		log('[TEST] DO Expected:', original);
		assert.deepStrictEqual(editorText, original);
		assert.ok(editorText?.async);
		assert.ok(editorText.class === 'Device');
		assert.ok(isObject(editorText.Common));
		log('[TEST] convert DO - PASSED');

	}).timeout(50000);

	test('clearing all editors 3', async () => {
		log('[TEST] clearing all editors 3 - START');
		//	clear all open editors
		await commands.executeCommand('workbench.action.closeAllEditors');
		log('[TEST] clearing all editors 3 - DONE');
	}).timeout(5000);
});
