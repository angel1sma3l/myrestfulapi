const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render( 'index.html', { home: 'welcome to my app' } );
});
// router.get('/', (req, res) => {
//   res.send({ express: 'YOUR NODEJS BACKEND IS CONNECTED TO REACT' });
// });

module.exports = router;