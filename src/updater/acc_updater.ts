/*
 * Copyright 2020. F5 Networks, Inc. See End User License Agreement ("EULA") for
 * license terms. Notwithstanding anything to the contrary in the EULA, Licensee
 * may copy and modify this software product for its internal business purposes.
 * Further, Licensee may upload, publish and distribute the modified version of
 * the software product on devcentral.f5.com.
 */

'use strict';

import { ExtHttp, Logger } from 'f5-conx-core';

const logger = Logger.getLogger();

type GitAsset = {
    label: string;
    asset: string;
}


export class AccUpdater {

    /**
     * 
     * https://github.com/f5devcentral/f5-as3-config-converter/releases
     */
    gitUrl = '/5devcentral/f5-as3-config-converter'
    //  https://api.github.com/repos/f5devcentral/vscode-f5/releases
    releases = 'https://api.github.com/repos/f5devcentral/f5-as3-config-converter/releases'
    latestRelease = 'https://api.github.com/repos/f5devcentral/f5-as3-config-converter/releases/latest'

    logger: Logger;
    extHttp: ExtHttp;
    constructor(logger: Logger, extHttp: ExtHttp) {
        this.logger = logger;
        this.extHttp = extHttp;
    }


    /**
     * download latest acc release from 
     * 
     * https://github.com/f5devcentral/f5-as3-config-converter
     */
    async download() {

        return await this.getGitAssetUrl(this.latestRelease)
            .then(async resp => {

                const fileName = resp.url.split('/').pop() || 'tempAccDockerImage.tar.gz';

                return await this.extHttp.download(resp.url, fileName, '.')
            })

    }


    /**
     * lists assests/releases of selected atc git
     * @param url atc github releases url
     * @returns asset name and download url as object
     */
    async getGitAssetUrl(url: string): Promise<{name: string, url: string}> {

        return await this.extHttp.makeRequest({ url })
        .then( resp => {
            const image = resp.data.assets.filter( (el: { name: string; }) => el.name.endsWith('.tar.gz') ).pop()
            return { 
                name: image.name,
                url: image.browser_download_url
            }
        })

    }
}