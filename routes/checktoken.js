const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();


//ROUTE methods Get
router.get('/', auth, (req, res) => {
    res.sendStatus(200);
});

module.exports = router;