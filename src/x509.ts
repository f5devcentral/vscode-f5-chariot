
/*
 * Copyright 2020. F5 Networks, Inc. See End User License Agreement ("EULA") for
 * license terms. Notwithstanding anything to the contrary in the EULA, Licensee
 * may copy and modify this software product for its internal business purposes.
 * Further, Licensee may upload, publish and distribute the modified version of
 * the software product on devcentral.f5.com.
 */

'use strict';



import * as tls from 'tls';
import * as net from 'net';

export function parseX509(cert: string): string {



    const secureContext = tls.createSecureContext({ cert });
    const {subject, issuer, valid_from, valid_to, serialNumber, bits} = new tls.TLSSocket(new net.Socket(), {secureContext}).getCertificate();


    return JSON.stringify({
        subject,
        issuer,
        valid_from,
        valid_to,
        serialNumber,
        bits
    });

}


const z = `
{
    subject: [Object: null prototype] {
      C: 'US',
      ST: 'state1',
      L: 'local1',
      O: 'org1',
      OU: 'div1',
      CN: 'secureTest.benlab.io',
      emailAddress: 'no@email.com'
    },
    issuer: [Object: null prototype] {
      C: 'US',
      ST: 'state1',
      L: 'local1',
      O: 'org1',
      OU: 'div1',
      CN: 'secureTest.benlab.io',
      emailAddress: 'no@email.com'
    },
    modulus: 'C04FA3644DF21081B3D70FE024D265775CA99C31CCFC6210CDE3D416EDAFE8E52D3B655740407164CECC161009BF7A6932900013A8F236E5274D5CEF64150A46B4E4E9F29DEF6A2337963A901F03297D64AFB13525C0B19A5F969CDC8907ACF071CF1AA1935936640EE10A4A0BB9F4173A924F8527D4231C17E4C92CB4207C35B729853C9282C76304084DE886ACDD0BF07A8C232B8F67CC1A5064BB2DAE6D42B0625C89083B855224F0B15735915552FD945AAD2C23CDE67AA4ED0774E4E8361DB7840C3952DF6D0EBD551E2BFE5D0FDF077A12A04F121252CB4E0C5401EF3B947FE7A0F715311F500B65E50579C93D8FDC9968BF614648918E3BD95FB33F9F',
    bits: 2048,
    exponent: '0x10001',
    pubkey: <Buffer 30 82 01 22 30 0d 06 09 2a 86 48 86 f7 0d 01 01 01 05 00 03 82 01 0f 00 30 82 01 0a 02 82 01 01 00 c0 4f a3 64 4d f2 10 81 b3 d7 0f e0 24 d2 65 77 5c ... 244 more bytes>,
    valid_from: 'Feb 21 01:48:54 2021 GMT',
    valid_to: 'Feb 19 01:48:54 2031 GMT',
    fingerprint: '68:88:11:04:14:EA:99:85:44:E9:E9:08:99:E5:8D:7F:4C:4B:DF:DA',
    fingerprint256: '2E:BE:88:73:C5:6A:9A:70:BC:39:A8:CD:DE:3F:17:59:17:4E:53:7B:0C:80:8E:8F:9C:BE:8D:81:A1:CE:A6:4D',
    serialNumber: '14F41086',
    raw: <Buffer 30 82 03 90 30 82 02 78 a0 03 02 01 02 02 04 14 f4 10 86 30 0d 06 09 2a 86 48 86 f7 0d 01 01 0b 05 00 30 81 89 31 0b 30 09 06 03 55 04 06 13 02 55 53 ... 866 more bytes>
  }
`;