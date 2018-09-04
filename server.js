const express = require('express');
const next = require('next');
const { Op } = require('sequelize');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const bodyParser = require('body-parser');

// models
const { Member, Attendance } = require('./models');

start = async () => {
  await app.prepare();

  const server = express();
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: true }));

  server.get('/api/members', async (req, res) => {
    try {
      const members = await Member.findAll();
      if (members) {
        res.status(200).send(members);
      } else {
        res.status(500).send('server error');
      }
    } catch (err) {
      res.status(500).send(err);
    }
  });

  server.post('/api/attendance', async (req, res) => {
    try {
      const memberId = req.body.id;
      const attendance = await Attendance.create({ memberId });
      if (attendance) {
        res.status(200).send(attendance);
      } else {
        res.status(500).send('server error');
      }
    } catch (err) {
      res.status(500).send(err);
    }
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
