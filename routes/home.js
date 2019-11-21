const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', {title: 'Views', message: 'Hello people', message3: "Another hello for you"});
});

module.exports = router;
