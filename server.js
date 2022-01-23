const connect = require('connect');
const serveStatic = require('serve-static');
const open = require('open');

connect().use(serveStatic(__dirname + "/docs")).listen(1111, async function(){
    console.log('Server running on port: 1111...');
    await open('http://localhost:1111/index.html');
});