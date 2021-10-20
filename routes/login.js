const express = require('express');
const router = express.Router();
const { showController, accessController } = require('../controllers/loginController');
const { publicLogged } = require('../middlewares/middleware');
const validator = require('./../helpes/validation');

/* GET login page. */
router.get('/', publicLogged, showController);
router.post('/access', publicLogged, validator.register(), validator.validationResponse, accessController);


module.exports = router;