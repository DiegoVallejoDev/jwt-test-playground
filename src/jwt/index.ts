const crypto = require('crypto');

const B64 = (msg: string) => {
    return Buffer.from(msg).toString('base64')
}
const HS256 = (msg: string, key: string) => {
    return crypto.createHmac('sha256', key).update(msg).digest('base64');
}


export class JWT {
    private secret: string;
    private header: {alg: string, typ: string};
    constructor(secret: string) {
        this.secret = secret;
        this.header = {
            alg: 'HS256',
            typ: 'JWT'
        };
    }
    sign(payload: any): string{
        const B64_Header = B64(JSON.stringify(this.header));
        const B64_Payload = B64(JSON.stringify(payload));
        const SHA256_Sign = HS256(B64_Header + '.' + B64_Payload, this.secret).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
        return B64_Header + '.' + B64_Payload + '.' + SHA256_Sign;
    
    }
    verify(token: string): Boolean{
        const [B64_Header, B64_Payload, SHA256_Sign] = token.split('.');
        const SHA256_Sign_New = HS256(B64_Header + '.' + B64_Payload, this.secret).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

        const payload = JSON.parse(Buffer.from(B64_Payload, 'base64').toString());
        const exp = payload.exp;
        const now = Math.floor(Date.now() / 1000);
        if ( exp < now ) {
            console.log("Token is expired");
            return false;
        }

        return SHA256_Sign === SHA256_Sign_New;
    }
    verify_no_exp(token: string): Boolean{
        const [B64_Header, B64_Payload, SHA256_Sign] = token.split('.');
        const SHA256_Sign_New = HS256(B64_Header + '.' + B64_Payload, this.secret).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
        return SHA256_Sign === SHA256_Sign_New;
    }
}


