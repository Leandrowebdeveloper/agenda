const {
    check,
    validationResult
} = require('express-validator');


const validator = {
    empty(failds, name) {
        return check(failds).not()
            .isEmpty()
            .withMessage(`Campo ${name} obrigatório.`);
    },
    name(filds) {
        return check(filds).not()
            .isEmpty()
            .withMessage('Campo nome obrigatório.')
            .matches(/^(?![ ])(?!.*(?:\d|[ ]{2}|[!$%^&*()_+|~=\{\}\[\]:";<>?,\/]))(?:(?:e|da|do|das|dos|de|d'|D'|la|las|el|los|l')\s*?|(?:[A-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð'][^\s]*\s*?)(?!.*[ ]$))+$/)
            .withMessage('Nome não e válido!')
            .trim().escape()
    },
    email() {
        return check('email').not()
            .isEmpty()
            .withMessage('Campo email obrigatório.')
            .matches(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)
            .withMessage('E-mail não e válido!')
            .normalizeEmail()

    },
    password() {
        return check('password').not()
            .isEmpty()
            .withMessage('Campo senha obrigatório.')
            .isLength({
                min: 8,
                max: 12
            })
            .withMessage('Senha deve ter mínimo 8 e maximo 12 caracteres.')
            .matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
            .withMessage('Campo senha deve ter símbolos ( ! @ # $ % ^ & * ), letras maiúsculas, minúsculas e números.')
    },
    logPassword() {
        return this.empty('password', 'senha');
    },
    register() {
        return [this.email(), this.password()];
    },
    user() {
        return [this.name('firstName'),  this.email(), this.password()];
    },
    userUpdate() {
        return [this.name('firstName'),  this.email()];
    },
    login() {
        return [this.email(), this.logPassword()];
    },
    recover() {
        return [this.email()];
    },
    contact() {
        return this.empty('firstName', 'nome');
    },
    iD() {
        return this.empty('_id', 'id');
    },
    validationResponse(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.locals.errors = errors.array();
        }
        next();
    }

}
module.exports = validator;