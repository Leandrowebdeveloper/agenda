const jwt = require('jsonwebtoken');
const { bcryptCompare } = require("../helpes/help");
const User = require('./UserModel');
require('dotenv').config();

class Login extends User {
    constructor(data) {
        super(data);
    }

    async logged() {
        this.user = await this.isUser();
        return bcryptCompare(this.data.password, this.user.password);
    }


    setToken() {
        const {
            id,
            email
        } = this.user;
        return this.generateAccessToken({
            id,
            email
        });
    }

    /**
     * @name generateAccessToken
     * @class  MiddlewareController
     * @readonly Gera o tokem jwt para 7 dias
     * @param data ex: { id: user.id, email: user.email }
     * @returns 
     */
    generateAccessToken(data) {
        return jwt.sign(data, process.env.TOKEN_SECRET, {
            expiresIn: 60 * 60 * 24 * 7
        });
    }

    /**
     * @name auth
     * @class Login
     * @readonly Verifica se exite um tokem valido se existir cria uma sessão
     * @param token jwt
     */
    static getAuthorization(token) {
        return jwt.verify(token, process.env.TOKEN_SECRET);
    }

    static async isAuthorization(id, email) {
        return await UserModel.findOne({
            id
        });
    }

    static dataSession(values) {
        return {
            id: values.id,
            email: values.email
        };
    }


}

module.exports = Login;