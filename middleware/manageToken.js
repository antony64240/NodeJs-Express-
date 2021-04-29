const jwt =require('jsonwebtoken');
const Cryptr =require('cryptr');

class ManageToken
{
    createToken(data) {
        const generate = jwt.sign({data}, "secret");
        return generate;
    }

    decodeToken(token) {
        var decoded = jwt.verify(token, "secret");
        return decoded;
    }

    verifyToken(token) {
        try {
            var decoded = jwt.verify(token, "secret");
                if(decoded.data.tokenExpiration > Date.now()){
                    return true;
                }else{
                    return false;
                }
          } catch(err) {
            return 'Token invalid';
          }
    }

    cryptToken(token) {
        const encrypt = new Cryptr("secret");
        return encrypt.encrypt(token);
    }

    decryptToken(crypted) {
        try {
            const decrypt = new Cryptr("secret");
            return decrypt.decrypt(crypted);
        } catch(err) {
            return "Impossible to decrypte token";
        }
    }

    generateEncode(data) {
        const token = this.createToken(data);
        const encrypt_token = this.cryptToken(token);
        return encrypt_token;
    }

    generateDecode(token) {
        const to = this.decryptToken(token);
        const t = this.decodeToken(to);
        return t;
    }
}
module.exports = ManageToken;
