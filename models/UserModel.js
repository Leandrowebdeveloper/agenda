const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const { bcrypt } = require("../helpes/help");
require('dotenv').config();

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: false,
        default: ''
    },
    lastName: {
        type: String,
        required: false,
        default: ''
    },
    level: {
        type: Number,
        required: true,
        default: 2
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    updateAt: {
        type: Date,
        default: Date.now
    }
});

const UserModel = mongoose.model('User', UserSchema);

class User {
    constructor(data) {
        this.data = data;
        this.user = null;
    }

    get datas() {
        const user = {
            firstName: this.data.firstName,
            lastName: this.data.lastName,
            level: this.data.level,
            email: this.data.email,
            password: bcrypt(this.data.password)
        }
        if(this.id && this.data.password === ''){
            delete user.password;
        }
        return user;
    }

    get id() {
        return this.data._id;
    }

    get objId() {
        return {
            _id: this.id
        };
    }

    set id(value) {
        this.data._id = value;
    }


    async select() {
        try {
            const user = await UserModel.findOne(this.objId);
            return user;
        } catch (error) {
            throw new Error(`Erro na base da dados tipo ${error}`);
        }
    }


    async isUser() {
        const user = await UserModel.findOne({email: this.datas.email});
        return user;
    }


    async create() {
        try {
            const user = await UserModel.create(this.datas);
            return user;
        } catch (error) {
            console.log(error)
            throw new Error(`Erro na base da dados tipo ${error}`);
        }
    }


    async show() {
        try {
            const user = await UserModel.find({});
            return user;
        } catch (error) {
            throw new Error(`Erro na base da dados tipo ${error}`);
        }
    }

    async find(id) {
        try {
            const user = await UserModel.find({ _id: id });
            return user;
        } catch (error) {
            throw new Error(`Erro na base da dados tipo ${error}`);
        }
    }

    async level(id) {
        try {
            const user = await UserModel.findOne({ _id: id });
            return user.level;
        } catch (error) {
            throw new Error(`Erro na base da dados tipo ${error}`);
        }
    }


    async update() {
        try {
            const user = await UserModel.updateOne(this.objId, this.datas).set('updatedAt', Date.now);
            return user.acknowledged;
        } catch (error) {
            throw new Error(`Erro na base da dados tipo ${error}`);
        }
    }

    async destroy() {
        try {
            const user = await UserModel.deleteOne(this.objId);
            return user.deletedCount;
        } catch (error) {
            throw new Error(`Erro na base da dados tipo ${error}`);
        }
    }

    static dataHeader(id = null) {
        return {
            id,
            header: `${(id ? 'fas fa-user-edit': 'fas fa-user-plus' )}`,
            subHeader: `${(id  ? 'Editar': 'Adicionar' )} usuário`,
            title: `${(id  ? 'Editar': 'Novo' )} usuário`,
            subTitle: `${(id  ? 'Editar usuário': 'Adicionar novos usuário')}.`,
            url: `${(id  ? '/painel-de-controle/editar/usuarios': '/painel-de-controle/usuarios')}`
        }
    }
}
module.exports = User;