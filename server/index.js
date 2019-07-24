const express = require('express')
const consola = require('consola')
const cookieParser = require('cookie-parser')
const { Nuxt, Builder } = require('nuxt')
const app = express()

const config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

async function start() {
  const nuxt = new Nuxt(config)
  const { host, port } = nuxt.options.server
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }


  app.use(express.json());
  app.use(cookieParser('MY_SIGNED_COOKIE_SUPER_SECRET')); 
  // cookie is just for client side route protection (we check user-auth-state with firebase admin sdk to protect API)
  const cookieOptions = {
    secure: false, // in production, set it to true.
    httpOnly: true, 
    signed: true, 
    maxAge: 60 * 60 * 1000, // equal to firebase auth token expiracy.
    sameSite: true  // for CSRF 
  };

  app.post('/api/auth/register', (req, res) => { 
    // Register User who authenticated By Firebase Auth to DB and Set Cookie.
    const { uid, email } = req.body;
    // <INSERT A USER INTO DB.....>
    res.cookie('authToken', { uid }, cookieOptions);
    res.send({ msg: 'register success'});
  });

  app.post('/api/auth/login', (req, res) => { // for set cookie when user loggedIn or user reflesh token.
    // reset expracy of cookie (1hour for now) in order to sync firebase idToken expiracy.
    res.cookie('authToken', { uid: req.body.uid }, cookieOptions);
    res.send({ msg: 'login success' });
  });

  app.get('/api/auth/logout', (req, res) => {
    res.clearCookie('authToken');
    // TODO: revoke reflesh token with firebase admin SDK.
    res.send({ msg: 'logout success' });
  });
  
  app.use(nuxt.render)

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()


// Example) Revoke User Reflesh Token when IP address is suspicious. 

// app.post('/getRestrictedData', (req, res) => {
//   // Get the ID token passed.
//   const idToken = req.body.idToken;
//   // Verify the ID token, check if revoked and decode its payload.
//   admin.auth().verifyIdToken(idToken, true).then((claims) => {
//     // Get the user's previous IP addresses, previously saved.
//     return getPreviousUserIpAddresses(claims.sub);
//   }).then(previousIpAddresses => {
//     // Get the request IP address.
//     const requestIpAddress = req.connection.remoteAddress;
//     // Check if the request IP address origin is suspicious relative to previous
//     // IP addresses. The current request timestamp and the auth_time of the ID
//     // token can provide additional signals of abuse especially if the IP address
//     // suddenly changed. If there was a sudden location change in a
//     // short period of time, then it will give stronger signals of possible abuse.
//     if (!isValidIpAddress(previousIpAddresses, requestIpAddress)) {
//       // Invalid IP address, take action quickly and revoke all user's refresh tokens.
//       revokeUserTokens(claims.uid).then(() => {
//         res.status(401).send({error: 'Unauthorized access. Please login again!'});
//       }, error => {
//         res.status(401).send({error: 'Unauthorized access. Please login again!'});
//       });
//     } else {
//       // Access is valid. Try to return data.
//       getData(claims).then(data => {
//         res.end(JSON.stringify(data);
//       }, error => {
//         res.status(500).send({ error: 'Server error!' })
//       });
//     }
//   });
// });