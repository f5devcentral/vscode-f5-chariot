
/*
 * Copyright 2020. F5 Networks, Inc. See End User License Agreement ("EULA") for
 * license terms. Notwithstanding anything to the contrary in the EULA, Licensee
 * may copy and modify this software product for its internal business purposes.
 * Further, Licensee may upload, publish and distribute the modified version of
 * the software product on devcentral.f5.com.
 */

'use strict';

import http = require('http');
// import https from 'https';

// https://stackoverflow.com/questions/31477497/node-js-native-file-upload-form



export default class Http {

    path = '/as3convert'

    constructor() {
        // nothing
    }

    // docker pull vzhuravlevf5/zvvaccdev:dev
    // docker run --rm -v "$PWD":/app/data -p 8080:8080 vzhuravlevf5/zvvaccdev:dev serve
    // curl -v http://localhost:8080/as3convert --form "conf=@/Users/dittmer/Desktop/toConvert.conf
    // https://stackoverflow.com/questions/31477497/node-js-native-file-upload-form

    async post(body: string) {

        // const data = JSON.stringify(body);

        // const baseOpts = {
        //     host: 'localhost',
        //     port: 8080,
        //     path: '/as3convert',
        //     method: 'POST',
        //     headers: {
        //         // 'Content-Type': 'application/json',
        //         'Content-Length': body.length
        //     }
        // };

        const baseOpts = {
            port: 8080,
            path: '/as3convert',
            // method: 'POST',
            // headers: {
            //     'Content-Length': body.length
            // }
        };

        const formBody =  JSON.stringify({
            "config": body
        });

        const resp = [];

        const req = http.request(baseOpts, (res: any) => {
            let data = '';

            res.on('data', (chunk: any) => {
                data += chunk;
            });

            res.on('end', () => {
                resp.push(res);
                return data;
            });

        }).on("error", (err: any) => {
            throw err(err);
        });

        // req.write(formBody);
        req.end();

    }

}