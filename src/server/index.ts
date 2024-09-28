import bodyParser from 'body-parser';
import fs from 'fs';
import jsonServer from 'json-server';
import jwt from 'jsonwebtoken';
import path from 'path';

interface LoginFormData {
  username: string;
  password: string;
}

// const authPath = path.join(path.resolve(), 'src/server/auth.json');
const dbPath = path.join(path.resolve(), 'src/server/db.json');
const SECRET_KEY = "minha-senha-super-secreta";
const expiresIn = "5m";

const createToken = (payload: Partial<LoginFormData>) => jwt.sign(payload, SECRET_KEY, { expiresIn });

const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return false;
  }
};

// if (!fs.existsSync(authPath)) {
//   fs.writeFileSync(authPath, `{ "secretKey": "1234567890", "expiresIn": "1h", "users": [], "authenticationURL": "api/auth/login", "authenticatedURL": ["/users"] }`);
// }

if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, `{ "timesheets": [], "users": [] }`);
}

const server = jsonServer.create();
const router = jsonServer.router(dbPath);
const middlewares = jsonServer.defaults();

const isAuthenticated = ({ username, password }: LoginFormData) => {
  const userdb = router.db.get('users').value();
  return userdb.findIndex((user: LoginFormData) => user.username === username && user.password === password)
};

// const isAuthorized = (req: unknown) => !!req || true;

server.use(middlewares);
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.get('/api/health', (req, res) => {
  res.sendStatus(200);
});

server.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body as LoginFormData;

  if (!isAuthenticated({ username, password })) {
    res.status(401).json({
      status: 401,
      message: 'Credenciais inválidas.'
    });
    return;
  }

  const token = createToken({ username });
  res.status(200).json({ token });
});

server.use((req, res, next) => {
  if (req.path === '/api/auth/login') {
    next();
  } else {
    if (
      !req.headers.authorization ||
      req.headers.authorization.split(' ')[0] !== 'Bearer'
    ) {
      res.status(401).json({
        status: 401,
        message: 'Credenciais inválidas.'
      });
      return;
    }

    const token = req.headers.authorization.split(' ')[1];
    const verified = verifyToken(token);

    if (!verified) {
      res.status(401).json({
        status: 401,
        message: 'Credenciais inválidas.'
      });
      return;
    }

    next()
  }
});

server.use((req, res, next) => {
  switch (req.method) {
    case 'POST':
      req.body.createdAt = Date.now();
      break;
    case 'PATCH':
    case 'PUT':
      req.body.modifieddAt = Date.now();
      break;
    case 'DELETE':
      req.body.deletedAt = Date.now();
      break;
  }

  next();
});

server.use('/api', router);
server.listen(3000, () => {
  console.log('JSON Server is running');
});
