const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const bodyParser = require('body-parser');

// models
const { Member } = require('./models');

start = async () => {
  await app.prepare();

  const server = express();
  server.use(bodyParser.json());

  server.get('/api/members', async (req, res) => {
    const members = await Member.findAll();
    res.status(200).send(members);
  });

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  const port = process.env.PORT || 3000;
  server.listen(port, err => {
    if (err) {
      throw err;
    }
    console.log(`> Ready on http://localhost:${port}`);
  });
};

start();
