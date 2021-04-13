

import { 
    window,
    workspace
} from "vscode";
import logger from "./logger";



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