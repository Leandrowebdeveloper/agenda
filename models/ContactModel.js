const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
    empty
} = require("../helpes/help");
require('dotenv').config();

const ContactSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: false,
        default: ''
    },
    email: {
        type: String,
        require: false,
        unique: true,
        default: ''
    },
    tel: {
        type: String,
        require: false,
        default: ''
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
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

const ContactModel = mongoose.model('Contact', ContactSchema);


class Contact {
    constructor(data = null) {
        this.data = data;
        this.contact = null;
    }

    get datas() {
        return {
            user: this.data.user,
            firstName: this.data.firstName.trim(),
            lastName: this.data.lastName.trim(),
            tel: this.data.tel.trim(),
            email: this.data.email.trim()
        }
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
            const contact = await ContactModel.findOne(this.objId);
            return contact;
        } catch (error) {
            throw new Error(`Erro na base da dados tipo ${error}`);
        }
    }


    async isContact() {
        const contact = await ContactModel.findOne(this.datas);
        return contact;
    }


    async create() {
        try {
            const contact = await ContactModel.create(this.datas);
            return contact;
        } catch (error) {
            throw new Error(`Erro na base da dados tipo ${error}`);
        }
    }


    async show() {
        try {
            const contact = await ContactModel.find({});
            // const contact = await ContactModel.find({}).populate('user'); // relacionamento
            return contact;
        } catch (error) {
            throw new Error(`Erro na base da dados tipo ${error}`);
        }
    }


    async update() {
        try {
            const contact = await ContactModel.updateOne(this.objId, this.datas).set('updatedAt', Date.now);
            return contact.acknowledged;
        } catch (error) {
            throw new Error(`Erro na base da dados tipo ${error}`);
        }
    }

    async destroy() {
        try {
            const contact = await ContactModel.deleteOne(this.objId);
            return contact.deletedCount;
        } catch (error) {
            throw new Error(`Erro na base da dados tipo ${error}`);
        }
    }


    static dataHeader(id = null) {
        return {
            id,
            header: `${(id ? 'fas fa-file-signature': 'fas fa-file-contract' )} contato`,
            subHeader: `${(id  ? 'Editar': 'Adicione' )} contatos a sua agenda`,
            title: `${(id  ? 'Editar': 'Novo' )} contato`,
            subTitle: `${(id  ? 'Editar contato da agenda': 'Adicione novos contatos a sua agenda')}.`,
            url: `${(id  ? '/painel-de-controle/editar/contato': '/painel-de-controle/contato')}`
        }
    }

}

module.exports = Contact;