const config = require('config');
const mongoose = require('mongoose');
const winston = require('winston');

module.exports = function() {

    //REQUIRED FOR mongodb@3.x.x
// Optional. Use this if you create a lot of connections and don't want
// to copy/paste `{ useNewUrlParser: true }`.
mongoose.set('useNewUrlParser', true); 
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

    const db = config.get('db');
    // connect to db
mongoose.connect(db)
.then(() => winston.info( `Connected to ${db}...`));

}
