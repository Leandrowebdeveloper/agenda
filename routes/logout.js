const express = require('express');
const { logout } = require('../controllers/loginController');
const router = express.Router();

/* GET login page. */
router.get('/', logout);


module.exports = router;