// // /* tslint-disable */
// // /* eslint-disable */
// // // tslint:disable
// /* eslint-disable @typescript-eslint/no-var-requires */
// /* eslint-disable no-undef */

// /*
//  * Copyright 2020. F5 Networks, Inc. See End User License Agreement ("EULA") for
//  * license terms. Notwithstanding anything to the contrary in the EULA, Licensee
//  * may copy and modify this software product for its internal business purposes.
//  * Further, Licensee may upload, publish and distribute the modified version of
//  * the software product on devcentral.f5.com.
//  */

// // 'use strict';

// // import fs = require('fs');
// const analytics = require('f5-appsvcs-acc/src/analytics');
// const as3Properties = require('f5-appsvcs-acc/src/maps/as3-properties-latest');
// const as3PropertiesCustom = require('f5-appsvcs-acc/src/maps/as3-properties-custom');
// const assessConf = require('f5-appsvcs-acc/src/assessConf');
// const converter = require('f5-appsvcs-acc/src/converter');
// const countObjects = require('f5-appsvcs-acc/src/countObjects');
// const declarationStats = require('f5-appsvcs-acc/src/declarationStats');
// const extract = require('f5-appsvcs-acc/src/extract');
// const filterByApplication = require('f5-appsvcs-acc/src/filterByApplication');
// const findLocation = require('f5-appsvcs-acc/src/util/convert/findLocation');
// const parse = require('f5-appsvcs-acc/src/parse');
// const readFiles = require('f5-appsvcs-acc/src/readFiles');
// const supported = require('f5-appsvcs-acc/src/maps/customDict');


// // export type AccConfig = {
// //     recognized: unknown;
// //     recognizedObjects: unknown;
// //     supported: unknown;
// //     supportedObjects: unknown;
// //     unsupported: unknown;
// //     unsupportedObjects: unknown;
// //     summary: unknown;
// //     debug: unknown;
// // }

// export default async function acc(data) {

//     const config = {
//         ucs: false,
//         container: false,
//         disableAnalytics: false,
//         recognized: true,
//         recognizedObjects: true,
//         supported: true,
//         supportedObjects: true,
//         unsupported: true,
//         unsupportedObjects: true,
//         summary: true,
//         debug: true,
//     };


//     // ### take input data and start the parsing engine
//     const json = parse({ "config.conf": data });

//     // extend as3Properties with custom
//     const as3PropertiesExt = Object.assign({}, as3Properties, as3PropertiesCustom);

//     // apply whitelist for AS3 and Charon support
//     const as3Json = assessConf(json, as3PropertiesExt);
//     const supportedJson = assessConf(json, supported);

//     // Clean up supported and AS3: remove iapp objects
//     const unsupportedObj = {};
//     const supportedKeys = Object.keys(supportedJson);
//     for (let i = 0; i < supportedKeys.length; i += 1) {
//         const checkKey = supportedKeys[i];
//         const loc = findLocation(checkKey);
//         if (loc.iapp && !checkKey.startsWith('sys application service')) {
//             unsupportedObj[checkKey] = supportedJson[checkKey];
//             delete as3Json[checkKey];
//             delete supportedJson[checkKey];
//         }
//     }

//     // convert json to AS3
//     const converted = converter(json, config);
//     const declaration = converted.decl;
//     // if (config.vsName) {
//     //     declaration = filterByApplication(declaration, config);
//     // }

//     converted.unsupportedObjects.forEach(obj => Object.assign(unsupportedObj, obj));
//     const jsonDeclaration = JSON.stringify(declaration, null, 4);

//     // find tmshVersion
//     let tmsh;
//     const fileKeys = Object.keys(data);
//     for (let i = 0; i < fileKeys.length; i += 1) {
//         const fileKey = fileKeys[i];
//         if (data[fileKey].includes('TMSH-VERSION')) {
//             tmsh = data[fileKey].split('\n')[0].split(' ')[1];
//             break;
//         }
//     }

//     // analyze generated declaration
//     const declarationInfo = declarationStats(declaration);
//     if (!config.disableAnalytics) {
//         await analytics({
//             arguments: process.argv,
//             configInputSize: JSON.stringify(data).length,
//             container: config.container,
//             declarationOutputSize: JSON.stringify(declaration).length,
//             declarationStats: declarationInfo.classes,
//             inputType: config.ucs ? 'ucs' : 'conf/scf',
//             objectsAS3Supported: countObjects(as3Json),
//             objectsCharonSupported: countObjects(supportedJson),
//             tmshVersion: tmsh,
//             totalObjectsDetected: countObjects(json),
//             unsupportedTypes: converted.unsupportedAnonymized
//         });
//     }

//     return jsonDeclaration;
// }