const express = require('express');
const { contact, contactCreate, newContact, contactDestroy, contactEdit, contactUpdate } = require('../controllers/contactController');
const { dashboardLogged, level } = require('../middlewares/middleware');
const router = express.Router();
const validator = require('../helpes/validation');
const { dashboard } = require('../controllers/dashboardController');
const { users, newUsers, usersEdit, usersCreate, usersUpdate, usersDestroy } = require('../controllers/usersController');


router.get('/', dashboardLogged, dashboard);
// contato 
router.get('/contato', dashboardLogged, contact);
router.get('/novo/contato', dashboardLogged, newContact);
router.post('/contato', dashboardLogged, validator.contact(), validator.validationResponse, contactCreate);
router.post('/excluir/contato', dashboardLogged, validator.iD(), validator.validationResponse, contactDestroy);
router.get('/editar/contato/:id', dashboardLogged, contactEdit);
router.post('/editar/contato', dashboardLogged, validator.contact(),  validator.iD(), validator.validationResponse, contactUpdate);


// usuários
router.get('/usuarios', dashboardLogged, users);
router.get('/novo/usuarios', dashboardLogged, level, newUsers);
router.post('/usuarios', dashboardLogged, level, validator.user(), validator.validationResponse, usersCreate);
router.post('/excluir/usuarios', dashboardLogged, level, validator.iD(), validator.validationResponse, usersDestroy);
router.get('/editar/usuarios/:id', dashboardLogged, usersEdit);
router.post('/editar/usuarios', dashboardLogged, validator.userUpdate(),  validator.iD(), validator.validationResponse, usersUpdate);

module.exports = router