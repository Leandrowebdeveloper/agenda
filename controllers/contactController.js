const {
    empty
} = require("../helpes/help");
const Contact = require("../models/ContactModel");


// listar todos os contatos
module.exports.contact = async (req, res) => {
    const contact = new Contact();
    const result = await contact.show();

    res.render('dashboard/contact/index', {
        dataHeader: Contact.dataHeader(),
        contact: result
    });
};






// Pagina novo contato
module.exports.newContact = (req, res) => {
    res.render('dashboard/contact/form', {
        dataHeader: Contact.dataHeader()
    });
};





// Cadastrar contato
module.exports.contactCreate = async (req, res) => {
    const data = req.body;
    data.user = req.session.user.id;
    res.locals.dataForm = data;
    const {
        tel,
        email
    } = data;
    if (tel.trim() === '' && email.trim() === '') {
        res.locals.errors.push({
            msg: 'Você deve cadastrar ou telefone ou o email.'
        });
    }
    if (res.locals.errors.length > 0) {
        return res.render('dashboard/contact/form', {
            dataHeader: Contact.dataHeader()
        });
    }
    try {
        const contact = new Contact(data);
        const isContact = await contact.isContact();
        if (!empty(isContact)) {
            res.locals.errors = [{
                msg: 'Contato já existe.'
            }];
            return res.render('dashboard/contact/form', {
                dataHeader: Contact.dataHeader()
            });
        }
        const result = await contact.create();
        if (!empty(result)) {
            res.redirect('/painel-de-controle/contato');
        }
    } catch (error) {
        res.render('error');
    }

};





// Delete contato
module.exports.contactDestroy = async (req, res) => {
    try {
        if (res.locals.errors.length > 0) {
            return res.render('error');
        }
        const {
            _id
        } = req.body;
        const contact = new Contact({
            _id
        });
        const result = await contact.destroy();
        if (result) {
            return res.redirect('/painel-de-controle/contato');
        }
    } catch (error) {
        res.render('error');
    }
};





//listar contato para editar
module.exports.contactEdit = async (req, res) => {
    const {
        id
    } = req.params;
    const contact = new Contact({
        _id: id
    });
    const result = await contact.select();
    res.locals.dataForm = result;
    res.render('dashboard/contact/form', {
        dataHeader: Contact.dataHeader(id)
    });
};





// Editar contato
module.exports.contactUpdate = async (req, res) => {
    const data = req.body;
    res.locals.dataForm = data;
    const {
        tel,
        email
    } = data;
    if (tel.trim() === '' && email.trim() === '') {
        res.locals.errors.push({
            msg: 'Você deve cadastrar ou telefone ou o email.'
        });
    }
    if (res.locals.errors.length > 0) {
        return res.render('dashboard/contact/form', {
            dataHeader: Contact.dataHeader(data._id)
        });
    }
    const contact = new Contact(data);
    contact.id = data._id;
    const result = await contact.update();
    if (result) {
        return res.redirect('/painel-de-controle/contato');
    }
};