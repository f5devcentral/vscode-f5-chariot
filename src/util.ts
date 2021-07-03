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
    window,
    workspace
} from "vscode";

import { As3Dec, Logger } from 'f5-conx-core';

const logger = Logger.getLogger();


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
export async function displayJsonInEditor(item: unknown): Promise<any> {
    return workspace.openTextDocument({
        language: 'json',
        content: JSON.stringify(item, undefined, 4)
    })
        .then(doc => {
            window.showTextDocument(doc, { preview: false });
            return doc;
        });
}



/**
 * capture entire active editor text or selected text
 */
export async function getText() {

    // get editor window
    const editor = window.activeTextEditor;
    if (editor) {
        // capture selected text or all text in editor
        if (editor.selection.isEmpty) {
            return editor.document.getText();	// entire editor/doc window
        } else {
            return editor.document.getText(editor.selection);	// highlighted text
        }
    } else {
        logger.warning('getText was called, but no active editor... this should not happen');
        throw new Error('getText was called, but no active editor... this should not happen');
        // return; // No open/active text editor
    }

}


/**
 * removes unique parameters like ID for tests
 * @param dec AS3 declaration
 * @returns 
 */
export async function cleanUniques(dec: As3Dec): Promise<As3Dec> {
    // take in as3 declarate, remove unique properties, return rest
    // id

    if(dec.declaration?.id) {
        delete dec.declaration.id;
    }
    
    return dec;
}