const express = require('express');
const router = express.Router();

/* GET login page. */
router.get('/', (req, res)=> {
    res.render('login');
});


module.exports = router;