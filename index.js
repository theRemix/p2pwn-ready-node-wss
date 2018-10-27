const server = require('./wss');
const rp = require('request-promise');
const localtunnel = require('localtunnel');
const PORT = process.env.PORT || 3000;
const P2PWN = process.env.P2PWN || 'https://p2pwithme.2018.nodeknockout.com';

const tunnel = localtunnel(PORT, function(err, tunnel) {
  if (err) {
    console.error(err);
    return process.exit(1);
  }

  console.log(`Tunnel created at: ${tunnel.url}`);
  rp(`${P2PWN}/connect`)
    .then(console.log)
    .catch(({message}) => console.error(message))
});

tunnel.on('close', function() {
  console.log('Tunnel closed!');
  rp(`${P2PWN}/disconnect`)
    .then(console.log)
    .catch(({message}) => console.error(message))
});

server.listen(PORT, () => console.log(`WSS Listening on port ${PORT}`));
