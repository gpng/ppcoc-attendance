const express = require('express');
const next = require('next');
const { Op } = require('sequelize');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const bodyParser = require('body-parser');

// models
const { Member, Attendance } = require('./models');

const start = async () => {
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
      const { reason, ids } = req.body;

      const attendance = await Attendance.bulkCreate(ids.map(x => ({ memberId: x, reason })));
      if (attendance) {
        res.status(200).send(attendance);
      } else {
        res.status(500).send('server error');
      }
    } catch (err) {
      res.status(500).send(err);
    }
  });

  server.get('/api/search', async (req, res) => {
    try {
      const { query } = req.query;
      const results = await Member.findAll({
        where: { name: { [Op.iLike]: `%${query}%` } },
        attributes: ['id', 'name'],
      });
      if (results) {
        res.status(200).send(results);
      } else {
        res.status(500).send('server error');
      }
    } catch (err) {
      res.status(500).send(err);
    }
  });

  server.get(
    '/.well-known/acme-challenge/8D2tLcnL_uYff1XSCpFll9SBC5KiLdCLZNmGcOxUb4k',
    async (req, res) => {
      res.send(
        '8D2tLcnL_uYff1XSCpFll9SBC5KiLdCLZNmGcOxUb4k.ekGfNElWLki-qTuIttZV4A2K9rkbjWhK988UjpJKn7w',
      );
    },
  );

  server.get('*', (req, res) => handle(req, res));

  const port = process.env.PORT || 3000;
  server.listen(port, (err) => {
    if (err) {
      throw err;
    }
    console.log(`> Ready on http://localhost:${port}`);
  });
};

start();
