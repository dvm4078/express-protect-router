# Express protect router with username, password

## Features

- Protect express router with username and password

## Installation

```shell
yarn add express-protect-router
```

or

```shell
npm install express-protect-router --save
```


## Basic Usage

```js
import express from 'express';
import Protect from 'express-protect-router';

const app = express();

const protecter = new Protect({ // pass into your configuration
  username: 'username',
  password: 'password',
  isProtec: process.env.NODE_ENV === 'development' ? 1 : 0 , // you may want the route to be protected in different environments. For example protection on development and permission on producton
});

protecter.init(app);

app.get('/', protecter.requireAuth, (req, res) => {
  return res.status(200).json({ message: 'Welcome to protect router' });
});

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log(`
    Port: ${3000}
    Env: ${app.get('env')}
  `);
});

export default app;
```

## Options

| Prop                                                                   | Using with env var     |                     Default                     | Description                                                                                                                                                                                           |
| :--------------------------------------------------------------------- | :------- | :----------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `username` | USER_NAME |  | |
| `password`  | PASSWORD |   | |
| `iss`  | ISS | 'thisisiss' | Iss used to sign a token |
| `expire`| EXPIRE | 60 * 60 * 24 (1 day) | Expire time of token |
| `secret`| SECRET | 'SESSION_SECRET' | Secret key of token |
| `isProtec`| PROTECT   |undefine| If isProtec is set to 0, authentication will be ignored |
| `redirectTo`|  | '/' | The router will redirect after authentication |
| `htmlPath` |  |  'static/login.html' | Path of the html file rather than the authentication form |
| `protectPath` | | '/auth' | The router sends up the credentials|
| `productionDomain` | |  | If specified and a value not equal to req.headers.host will enable protection|
