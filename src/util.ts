

import { Uri, window, workspace } from "vscode";
import logger from "./logger";



export async function browseFile() {

    let filePath: string;

    // no input means we need to browse for a local file
    return await window.showOpenDialog({
        canSelectMany: false
    })
        .then(item => {
            let newItem: Uri;

            // if we got a file from the showOpenDialog, it comes in an array, even though we told it to only allow single item selection -> return the single array item
            if(Array.isArray(item)) {
                // newItem = item[0];
                return item[0];
            } else {
                throw Error('somting');
            }

            // if (item.fsPath) {

            //     logger.debug(`f5.chariot.importImage _fsPath recieved:`, item.fsPath);
            //     filePath = item.fsPath;

            // } else if (item?.path) {

            //     logger.debug(`f5.chariot.importImage path revieved:`, item.path);
            //     filePath = item.path;

            // } else {

            //     return logger.error('f5.chariot.importImage -> Neither path supplied was valid', JSON.stringify(item));

            // }
        });

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
    .then( doc => 
        window.showTextDocument(
            doc, 
            { 
                preview: false 
            }
        )
    );
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