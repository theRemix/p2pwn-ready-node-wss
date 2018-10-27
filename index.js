const server = require('./wss');
const rp = require('request-promise');
const localtunnel = require('localtunnel');
const PORT = process.env.PORT || 3000;
const P2PWN = process.env.P2PWN || 'https://p2pwithme.2018.nodeknockout.com';

// CHANGE ME
const appName = 'p2pwnme-ready-node-wss';

const p2pwn = {       // all value will be provided by P2PWN
  id: null,           // public id assigned by P2PWN service
  access_token: null, // private access token needed to perform actions on this host
  display_name: null, // name supplied by appName for grouping rooms in P2PWN
  entry_url: null     // url used as the entrypoint for your app, supplied by localtunnel
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
  .then(res => Object.assign(p2pwn, res))
  .catch(({message}) => console.error(message))
});

tunnel.on('close', function() {
  console.log('Tunnel closed!');
  rp({
    uri: `${P2PWN}/host/${p2pwn.id}/disconnect`,
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
