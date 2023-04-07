require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.API_PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
});


/* 
Libraries used
npm install --save express morgan
npm i -D nodemon
npm i dotenv
npm i cors
npm install --save sequelize
npm install --save-dev sequelize-cli
npm install --save mysql2
npm install --save express-validator
*/