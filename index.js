const server = require('./wss');
const rp = require('request-promise');
const localtunnel = require('localtunnel');
const PORT = process.env.PORT || 3000;
const P2PWN = process.env.P2PWN || 'https://p2pwithme.2018.nodeknockout.com';

// CHANGE ME
const appName = 'p2pwnme-ready-node-wss';

let p2pwn = {
  hostId : null
};

const tunnel = localtunnel(PORT, (err, { url }) => {
  if (err) {
    console.error(err);
    return process.exit(1);
  }

  console.log(`Tunnel created at: ${url}`);
  rp({
    uri: `${P2PWN}/connect`,
    method: 'POST',
    body: {
      appName,
      url
    },
    json: true
  })
  .then(res => p2pwn = res)
  .catch(({message}) => console.error(message))
});

tunnel.on('close', function() {
  console.log('Tunnel closed!');
  rp({
    uri: `${P2PWN}/host/${p2pwn.hostId}/disconnect`,
    method: 'POST',
    body: {},
    json: true
  })
  .then(console.log)
  .catch(({message}) => console.error(message))
});

server.listen(PORT, () => console.log(`WSS Listening on port ${PORT}`));
