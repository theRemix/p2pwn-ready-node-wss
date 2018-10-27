const server = require('./wss');
const rp = require('request-promise');
const localtunnel = require('localtunnel');
const PORT = process.env.PORT || 3000;
const P2PWN = process.env.P2PWN || 'https://p2pwithme.2018.nodeknockout.com';

// CHANGE ME
const app_name = 'p2pwnme-ready-node-wss';   // group identifier
const display_name = 'P2PWN Ready Node WSS'; // this room's name to displayed
const release = 'DEVELOPMENT';               // 'DEVELOPMENT' | 'PRODUCTION'

const p2pwn = {       // all value will be provided by P2PWN
  id: null,           // public id assigned by P2PWN service
  access_token: null, // private access token needed to perform actions on this host
  app_name: null,     // for grouping rooms in P2PWN
  display_name: null, // used to display in P2PWN lobby
  entry_url: null     // url used as the entrypoint for your app, supplied by localtunnel
};

const tunnel = localtunnel(PORT, (err, { url }) => {
  if (err) {
    console.error(err);
    return process.exit(1);
  }

  console.log(`Tunnel created at: ${url}`);
  rp({
    uri: `${P2PWN}/api/connect`,
    method: 'POST',
    body: {
      app_name,
      display_name,
      release,
      entry_url: url
    },
    json: true
  })
  .then(res => Object.assign(p2pwn, res))
  .catch(({message}) => console.error(message))
});

tunnel.on('close', function() {
  console.log('Tunnel closed!');
  rp({
    uri: `${P2PWN}/api/host/${p2pwn.id}/disconnect`,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${p2pwn.access_token}`
    },
    body: {},
    json: true
  })
  .then(console.log)
  .catch(({message}) => console.error(message))
});

server.listen(PORT, () => console.log(`WSS Listening on port ${PORT}`));
