const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

class Protect {
  constructor(configs = {}) {
    this.username = configs.username || process.env.USER_NAME;
    this.password = configs.password || process.env.PASSWORD;
    this.iss = configs.iss || process.env.ISS || 'thisisiss';
    this.expire = configs.expire || process.env.EXPIRE || 60 * 60 * 24; // 1 day
    this.secret = configs.secret || process.env.SECRET || 'SESSION_SECRET';
    this.isProtec = configs.isProtec || process.env.PROTECT;
    this.redirectTo = configs.redirectTo || '/';
    this.htmlPath = configs.htmlPath || 'static/login.html';
    this.protectPath = configs.protectPath || '/auth';
    this.productionDomain = configs.productionDomain;
  }

  init = (server) => {
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: true }));
    server.use(cookieParser());

    server.get(this.protectPath, this.requireUnAuth, (req, res) => {
      res.sendFile(this.htmlPath, { root: __dirname });
    });

    server.post(this.protectPath, (req, res) => {
      const { username, password } = req.body;
      if (username === this.username && password === this.password) {
        const token = jwt.sign({ username, password, iss: this.iss }, this.secret, {
          expiresIn: this.expire,
        });
        res.cookie('X_ACCESS_TOKEN', token);
        return res.end();
      }
      res.status(401);
      return res.end();
    });
  }

  requireAuth = (req, res, next) => {
    if ((this.productionDomain && this.productionDomain !== req.headers.host) || this.isProtec) {
      const token = req.cookies['X_ACCESS_TOKEN'];
      jwt.verify(token, this.secret, async (err, decoded) => {
        if (decoded && decoded.username === this.username && decoded.password === this.password && decoded.iss === this.iss) {
          return next();
        }
        return res.redirect(this.protectPath);
      });
    } else {
      next();
    }
  }

  requireUnAuth = (req, res, next) => {
    if ((this.productionDomain && this.productionDomain !== req.headers.host) || this.isProtec) {
      const token = req.cookies['X_ACCESS_TOKEN'];
      jwt.verify(token, this.secret, async (err, decoded) => {
        if (decoded && decoded.username === this.username && decoded.password === this.password && decoded.iss === this.iss) {
          return res.redirect(this.redirectTo);
        }
        return next();
      });
    } else {
      return res.redirect(this.redirectTo);
    }
  }
}

module.exports = Protect;