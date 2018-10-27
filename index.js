const server = require('./wss');
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`WSS Listening on port ${PORT}`));
