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

import fs from 'fs';

import {
    Position,
    Range,
    TextDocument,
    Uri,
    ViewColumn,
    window,
    workspace
} from "vscode";

import Logger from 'f5-conx-core/dist/logger';

const logger = new Logger('F5_CHARIOT_LOG_LEVEL');


/**
 * import/require file to string variable
 * @param path file path/name
 * @returns file contents as string
 */
export function requireText(path: string): string {
    return fs.readFileSync(require.resolve(path)).toString();
}

/**
 * display json in new editor window
 * @param item json object to display in new editor
 */
export async function displayJsonInEditor(text: string, type: 'DO' | 'AS3'): Promise<TextDocument> {

    let vDoc: Uri;
    if (type === 'AS3') {
        vDoc = Uri.parse("untitled:" + 'converted.as3.json');
    } else {
        vDoc = Uri.parse("untitled:" + 'converted.do.json');
    }


    return await workspace.openTextDocument(vDoc)
        .then((a: TextDocument) => {
            window.showTextDocument(a, ViewColumn.Beside, false).then(e => {
                e.edit(edit => {
                    const startPosition = new Position(0, 0);
                    const endPosition = a.lineAt(a.lineCount - 1).range.end;
                    edit.replace(new Range(startPosition, endPosition), JSON.stringify(text, undefined, 4));
                });
            });
            return a;
        });
}



/**
 * capture entire active editor text or selected text
 */
export async function getText(doc?: TextDocument) {

    // get editor window - should only happen from right-click
    const editor = window.activeTextEditor;
    if (editor) {
        // capture selected text or all text in editor
        if (editor.selection.isEmpty) {
            return editor.document.getText();	// entire editor/doc window
        } else {
            return editor.document.getText(editor.selection);	// highlighted text
        }
    } else if (doc) {
        // got doc definition and no editor, so this should be automated tests
        return doc.getText();
    } else {
        logger.warn('getText was called, but no active editor... this should not happen');
        throw new Error('getText was called, but no active editor... this should not happen');
        // return; // No open/active text editor
    }

}


/**
 * sanitize dec from params that can change but are not critical to deployment (ex. id/schemaVersion/remark/label)
 * @param dec AS3 declaration
 * @returns 
 */
export async function cleanUniques(dec: any): Promise<unknown> {
    // take in as3 declarate, remove unique properties, return rest

    if (dec.id) {
        dec.id = undefined;
    }

    if (dec.schemaVersion) {
        dec.schemaVersion = undefined;
    }

    // new way to sanitize fields
    dec.remark = undefined;
    dec.label = undefined;

    return dec;
}