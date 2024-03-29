var swaggerAutogen = require("swagger-autogen");
var doc = {
    info: {
        title: 'Clutter - Cut the Clutter, Share the Flair',
        description: 'API documentation of all endpoints.',
    },
    host: 'scissors-kl37.onrender.com',
    schemes: ['https'],
};
var outputFile = '../../swagger-output.json';
var endpointsFiles = ['../../main.ts']; // Update file extension to .ts
swaggerAutogen()(outputFile, endpointsFiles, doc).then(function () {
    require('../../main.ts');
});
