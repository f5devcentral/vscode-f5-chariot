/*
 * Copyright 2020. F5 Networks, Inc. See End User License Agreement ("EULA") for
 * license terms. Notwithstanding anything to the contrary in the EULA, Licensee
 * may copy and modify this software product for its internal business purposes.
 * Further, Licensee may upload, publish and distribute the modified version of
 * the software product on devcentral.f5.com.
 */

'use strict';


import { ExtensionContext, workspace } from "vscode";



export class Settings {
    readonly extPath;
    accImage!: string;
    outPutFile!: string;
    fullCmd: string | undefined;
    constructor(context: ExtensionContext) {
        // nothing
        this.extPath = context.extensionPath;
        // this.accImage = '';
        // this.outPutFile = '';
        // this.fullCmd = '';
        this.loadConfig();
    }


    
    async loadConfig(x?: any) {
        //
        const y = workspace.getConfiguration('f5-chariot');
        
        this.accImage = workspace.getConfiguration().get('f5.chariot.image', 'f5-appsvcs-charron:1.8.0');
        this.outPutFile = workspace.getConfiguration().get('f5.chariot.outFileName', 'converted.as3.json');
        this.fullCmd = workspace.getConfiguration().get('f5.chariot.fullCommand');
        
    }


}