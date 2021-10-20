const {
    empty
} = require("../helpes/help");
const User = require("../models/UserModel");



// listar todos os contatos
module.exports.users = async (req, res) => {
    try {
        // id da Sessão
        const { id } = req.session.user;

        // Instância  
        const user = new User();
        let result = {};

        // Verifica o nivel do usuário
        const level = await user.level(id);
        if (level === 1) {
            // lista todos os usuários
            result = await user.show();
        } else {
            // lista apenas um usuário
            result = await user.find(id);
        }

        // Lista a pagina do usuário
        res.render('dashboard/user/index', {
            dataHeader: User.dataHeader(),
            user: result
        });

    } catch (error) {
        res.render('error');
    }
};






// Pagina criar novo contato
module.exports.newUsers = (req, res) => {
    try {

        res.render('dashboard/user/form', {
            dataHeader: User.dataHeader()
        });
    
    } catch (error) {
        res.render('error');
    }
};





// Cadastrar contato
module.exports.usersCreate = async (req, res) => {
    
    try {

        const data = req.body;
        res.locals.dataForm = data;// variavel local 


        // Dispara error de validação do formulario 
        if (res.locals.errors.length > 0) {
            return res.render('dashboard/user/form', {
                dataHeader: User.dataHeader()
            });
        }

        // Instância da class
        const user = new User(data);


        // Verifica se existe email cadastrado no sistema
        const isUser = await user.isUser();


        if (!empty(isUser)) {

            // Dispara um menssagem de error
            res.locals.errors = [{
                msg: 'Usuário já existe.'
            }];
            return res.render('dashboard/user/form', {
                dataHeader: User.dataHeader()
            });
        }

        // cria um novo usuario
        const result = await user.create();

        // Usuário criado com sucesso
        if (!empty(result)) {
           return res.redirect('/painel-de-controle/usuarios');
        }

    } catch (error) {
        res.render('error');
    }

};





// Delete contato
module.exports.usersDestroy = async (req, res) => {
    try {
        if (res.locals.errors.length > 0) {
            return res.render('error');
        }
        const {
            _id
        } = req.body;
        const user = new User({
            _id
        });
        const result = await user.destroy();
        if (result) {
            return res.redirect('/painel-de-controle/usuarios');
        }
    } catch (error) {
        res.render('error');
    }
};





//listar contato para editar
module.exports.usersEdit = async (req, res) => {
    try {
        const {
            id
        } = req.params;
        const user = new User({
            _id: id
        });
        const result = await user.select();
        res.locals.dataForm = result;
        res.render('dashboard/user/form', {
            dataHeader: User.dataHeader(id)
        });
    } catch (error) {
        res.render('error');
    }
};





// Editar contato
module.exports.usersUpdate = async (req, res) => {
    try {
        const data = req.body;
        res.locals.dataForm = data;
        if (res.locals.errors.length > 0) {
            return res.render('dashboard/user/form', {
                dataHeader: User.dataHeader(data._id)
            });
        }
        const user = new User(data);
        user.id = data._id;
        const result = await user.update();
        if (result) {
            return res.redirect('/painel-de-controle/usuarios');
        }
    } catch (error) {
        res.render('error');
    }
};