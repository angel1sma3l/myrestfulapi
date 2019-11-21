const bcryptjs = require('bcryptjs');

async function run() {
    const salt = await bcryptjs.genSalt(10);
    const hashed = await bcryptjs.hash('1234', salt);
    console.log(hashed);
    console.log(salt);
}

run();