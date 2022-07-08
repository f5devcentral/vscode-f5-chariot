
'use strict';

import fs from 'fs';
import path from 'path';

import { ExtensionContext } from "vscode";

export async function loadTeemKey(ctx: ExtensionContext) {

    const filePath = path.join(ctx.extensionPath, 'TEEM_KEY');
    let tKey: string | undefined;

    // try to find/read/load key file from new extension install
    try {

        tKey = fs.readFileSync(filePath, 'utf-8');

        console.log('teem key file detected');

        // store key in vscode secret store
        await ctx.secrets.store('TEEM_KEY', tKey);

        // if we made it this far, wait 2 seconds, then delete the file
        setTimeout( () => { 
            console.log('Deleting key file at', filePath);
            fs.unlinkSync(filePath);
        }, 2000);

    } catch (e) {
        // if this doesn't work, just continue and try to load the key from secret
        // return;
    }

    // try to load the key from secrets
    tKey = await ctx.secrets.get('TEEM_KEY');

    // if after all that, set the env for with the key
    if(tKey) {
        process.env.TEEM_KEY = tKey;
    }
    
    // console.log(process.env);
}

