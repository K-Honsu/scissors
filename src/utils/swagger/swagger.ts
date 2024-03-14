const swaggerAutogen = require("swagger-autogen")
const doc = {
    info: {
        title: 'Clutter - Cut the Clutter, Share the Flair',
        description: 'API documentation of all endpoints.',
    },
    host: 'scissors-kl37.onrender.com',
    schemes: ['http'],
};

const outputFile = '../../swagger-output.json';
const endpointsFiles = ['../../main.ts'];

swaggerAutogen()(outputFile, endpointsFiles, doc).then(() => {
    require('../../main.ts');
});

