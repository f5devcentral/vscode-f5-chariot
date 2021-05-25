/* eslint-disable @typescript-eslint/no-var-requires */
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

// import fs = require('fs');
// const analytics = require('../acc/src/analytics');
const analytics = require('f5-as3-config-converter/src/analytics.js');
const as3Properties = require('f5-as3-config-converter/src/maps/as3-properties-latest');
const as3PropertiesCustom = require('f5-as3-config-converter/src/maps/as3-properties-custom');
const converter = require('f5-as3-config-converter/src/converter');
const countObjects = require('f5-as3-config-converter/src/util/countObjects');
const declarationStats = require('f5-as3-config-converter/src/declarationStats');
const extract = require('f5-as3-config-converter/src/extract');
const filterConf = require('f5-as3-config-converter/src/filterConf');
const filterByApplication = require('f5-as3-config-converter/src/filterByApplication');
const getBigipVersion = require('f5-as3-config-converter/src/getBigipVersion');
const getConfigFiles = require('f5-as3-config-converter/src/getConfigFiles');
const logObjects = require('f5-as3-config-converter/src/logObjects');
const parse = require('f5-as3-config-converter/src/parse');
const readFiles = require('f5-as3-config-converter/src/readFiles');
const removeDefaultValues = require('f5-as3-config-converter/src/removeDefaultValues');
const removeIapp = require('f5-as3-config-converter/src/removeIapp');
const supported = require('f5-as3-config-converter/src/maps/customDict');


export async function acc (data: any) {

    const config = {
        ucs: false,
        container: false,
        disableAnalytics: false,
        recognized: true,
        recognizedObjects: true,
        supported: true,
        supportedObjects: true,
        unsupported: true,
        unsupportedObjects: true,
        summary: true,
        debug: true,
        showExtended: true
    };

    // let files = [];

    // // Extract from UCS
    // if (config.ucs) {
    //     files = await getConfigFiles(config.ucs);
    // }

    // // parse input into JSON
    // const data = config.conf ? readFiles([config.conf]) : readFiles(files);

    const json = parse({ "config.conf": data });

    // extend as3Properties with custom
    const as3PropertiesExt = Object.assign({}, as3Properties, as3PropertiesCustom);

    // apply whitelist for AS3 and Charon support
    const as3Json = filterConf(json, as3PropertiesExt);
    const supportedJson = filterConf(json, supported);

   // Clean up supported and AS3: remove iapp objects
   const unsupportedObj = removeIapp(as3Json, supportedJson);

    // convert json to AS3
    const converted = converter(json, config);
    const declaration = converted.decl;

    // Filter by virtual server name
    // if (config.vsName) {
    //     declaration = filterByApplication(declaration, config);
    // }

    converted.unsupportedObjects.forEach((obj: any) => Object.assign(unsupportedObj, obj));
    
    
    // if (!config.showExtended) {
    //     declaration = removeDefaultValues(declaration);
    // }
        
    const jsonDeclaration = JSON.stringify(declaration, null, 4);
    const declarationInfo = declarationStats(declaration);
    const declarationInfoTotal = declarationInfo.total;
    const declarationInfoClasses = declarationInfo.classes;
    const inputType = config.ucs ? 'ucs' : 'conf/scf';

    // Count objects for statistic purposes
    const jsonCount = countObjects(json);
    const supportedJsonCount = countObjects(supportedJson);
    const as3JsonCount = countObjects(as3Json);

    // Send analitics
    const bigipVersion = getBigipVersion(data);
    if (!config.disableAnalytics) {
        await analytics({
            arguments: process.argv,
            configInputSize: JSON.stringify(data).length,
            container: config.container,
            declarationOutputSize: JSON.stringify(declaration).length,
            declarationStats: declarationInfo.classes,
            inputType,
            objectsACCSupported: supportedJsonCount,
            objectsAS3Supported: as3JsonCount,
            tmshVersion: bigipVersion,
            totalObjectsDetected: jsonCount,
            unsupportedTypes: converted.unsupportedAnonymized
        });
    }

    // // remove extracted
    // if (config.ucs) extract.cleanup();
    
    // logObjects({
    //     config,
    //     jsonCount,
    //     as3Json,
    //     as3JsonCount,
    //     jsonDeclaration,
    //     supportedJson,
    //     supportedJsonCount,
    //     declarationInfoTotal,
    //     declarationInfoClasses,
    //     unsupportedObj
    // });

    return {
        declaration,
        metaData: {
            recognized: as3Json,
            supported: supportedJson,
            unSupported: unsupportedObj,
            declarationInfo,
        }
    };
    // return jsonDeclaration;
}