const express = require('express');
const next = require('next');
const moment = require('moment');
const _ = require('lodash');
const sequelize = require('sequelize');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const bodyParser = require('body-parser');

const { Op } = sequelize;
const dev = process.env.NODE_ENV !== 'production';
const config = require('./config')[dev ? 'development' : 'production'];

const app = next({ dev });
const handle = app.getRequestHandler();

// models
const { Member, Attendance } = require('./models');

// constants
const { SERVICES, DATE_FORMAT } = require('./constants');

const start = async () => {
  await app.prepare();

  const server = express();
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: true }));

  // AUTH
  const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${config.auth0Domain}/.well-known/jwks.json`,
    }),

    // Validate the audience and the issuer.
    audience: config.auth0ClientId,
    issuer: `https://${config.auth0Domain}/`,
    algorithms: ['RS256'],
  });

  server.get('/api/members', checkJwt, async (req, res) => {
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

  server.put('/api/member/:id', checkJwt, async (req, res) => {
    try {
      const { id } = req.params;
      const { name, status, remarks } = req.body;
      const result = await Member.update(
        {
          name,
          status,
          remarks,
        },
        {
          where: {
            id,
          },
        },
      );
      if (result[0] > 0) {
        res.status(200).send('success');
        return;
      }
      res.status(500).send('no rows updated');
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

  server.post('/api/new', checkJwt, async (req, res) => {
    try {
      const { name, status, remarks } = req.body;

      const member = await Member.create({ name, status, remarks });
      if (member) {
        res.status(200).send(member);
      } else {
        res.status(500).send('server error');
      }
    } catch (err) {
      res.status(500).send(err);
    }
  });

  const getAbsentees = async (date) => {
    try {
      const results = await Member.findAll({
        where: {
          lastAttendance: {
            [Op.or]: [
              null,
              {
                [Op.lt]: date.toDate(),
              },
            ],
          },
        },
        attributes: ['id', 'name', 'lastAttendance'],
      });
      if (results) {
        return results;
      }
      return {};
    } catch (err) {
      console.error('getAbsentees error', err);
      return {};
    }
  };

  const getAttendanceNumbers = async (reason, date) => {
    try {
      const results = await Attendance.findAll({
        where: {
          reason,
          createdAt: {
            [Op.and]: [{ [Op.gte]: date.toDate() }, { [Op.lt]: date.add(1, 'days').toDate() }],
          },
        },
      });
      if (results) {
        const uniqueResults = _.uniqBy(results, 'memberId');
        return uniqueResults.length;
      }
      return 0;
    } catch (err) {
      console.error('getAttendanceNumbers error', err);
      return 0;
    }
  };

  server.get(
    '/.well-known/acme-challenge/8D2tLcnL_uYff1XSCpFll9SBC5KiLdCLZNmGcOxUb4k',
    async (req, res) => {
      res.send(
        '8D2tLcnL_uYff1XSCpFll9SBC5KiLdCLZNmGcOxUb4k.ekGfNElWLki-qTuIttZV4A2K9rkbjWhK988UjpJKn7w',
      );
    },
  );

  server.get('/api/report', checkJwt, async (req, res) => {
    try {
      const date = moment(req.query.date, DATE_FORMAT);
      const [absentees, ...servicesAttendance] = await Promise.all([
        getAbsentees(date),
        ...SERVICES.map(x => getAttendanceNumbers(x, date)),
      ]);
      const attendance = {};
      servicesAttendance.forEach((x, i) => {
        attendance[SERVICES[i]] = x;
      });
      res.send({ absentees, attendance });
    } catch (err) {
      res.status(500).send(err);
    }
  });

  server.get('/api/attendance', checkJwt, async (req, res) => {
    try {
      const results = await Attendance.findAll({
        include: [
          {
            model: Member,
          },
        ],
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

  // CLIENT
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
