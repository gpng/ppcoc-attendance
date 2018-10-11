import auth0 from 'auth0-js';

// constants
import { HOST } from '../../configs/client';
import configObj from '../../config';

const config = configObj.development;

class Auth {
  constructor() {
    this.auth0 = new auth0.WebAuth({
      // the following three lines MUST be updated
      domain: config.auth0Domain,
      // audience: `https://${config.auth0Domain}/userinfo`,
      clientID: config.auth0ClientId,
      redirectUri: `${HOST}/callback`,
      responseType: 'token id_token',
      scope: 'openid',
    });
  }

  getIdToken() {
    return this.idToken;
  }

  handleAuthentication() {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, authResult) => {
        if (err) return reject(err);
        if (!authResult || !authResult.idToken) {
          return reject(err);
        }
        this.idToken = authResult.idToken;
        // set the time that the id token will expire at
        this.expiresAt = authResult.expiresIn * 1000 + new Date().getTime();
        return resolve();
      });
    });
  }

  isAuthenticated() {
    return new Date().getTime() < this.expiresAt;
  }

  signIn() {
    this.auth0.authorize();
  }

  signOut() {
    this.auth0.logout({
      returnTo: HOST,
      clientID: config.auth0ClientId,
    });
  }
}

const auth0Client = new Auth();

export default auth0Client;
