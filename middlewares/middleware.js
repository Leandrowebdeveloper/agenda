const {
    empty
} = require("../helpes/help");
const Login = require("../models/LoginModel");
const User = require("../models/UserModel");





// verifica se existe csrf valido
// gera um erro 404 se não existir
module.exports.csrfTokenError = (err, req, res, next) => {
    if (err.code !== 'EBADCSRFTOKEN') return next(err);
    res.status(404).render('error');
}





// cria variaveis locais
module.exports.localsVar = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    res.locals.success = null;
    res.locals.errors = [];
    res.locals.dataForm = null;
    res.locals.user = req.session.user || null;
    next();
}





// middleware de sessão do usuário logado
module.exports.dashboardLogged = (req, res, next) => {
    if (empty(req.session.user)) {
        return res.redirect('/');
    }
    next();
}





// middleware de sessão do usuário de pagínas publicas
module.exports.publicLogged = (req, res, next) => {
    if (!empty(req.session.user)) {
        return res.redirect('/');
    }
    next();
}





// middleware de verificação de tokem de login do usuário
module.exports.authentication = async (req, res, next) => {
    try {
        const cookie = req.cookies['authorization'] || null;
        if (empty(req.session.user) && cookie !== null) {
            const {
                id,
                email
            } = Login.getAuthorization(cookie);
            if (id && email) {
                const authentication = await Login.isAuthorization(id, email);
                req.session.user = Login.dataSession(authentication);               
            }
        }
        next();
    } catch (error) {
        res.render('error')
    }
};


module.exports.level = async (req, res, next) => {
    try {
        // id da Sessão
        const { id } = req.session.user;

        // Instância  
        const user = new User();

        // Verifica o nivel do usuário
        const level = await user.level(id);
        if (level !== 1) {
          return  res.render('error');    
        } 
        next();

    } catch (error) {
        res.render('error');
    }
}
