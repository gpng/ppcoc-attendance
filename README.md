# PPCOC Attendance

[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-green.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

> Attendance system through browser search and entry.

A NextJS server-side rendered webapp served by an ExpressJS server and API, using PostgreSQL database, deployed using PM2 on a Raspberry Pi

## Table of Contents

- [Required Knowledge](#required-knowledge)
- [Learning Resources](#learning-resources)
- [Install](#install)
- [Usage](#usage)
- [Maintainers](#maintainers)
- [Contribute](#contribute)
- [License](#license)

## Required Knowledge

- JavaScript
  - [NodeJS](https://nodejs.org/en/)
  - [ReactJS](https://reactjs.org/)
  - [Express.js](https://expressjs.com/)
  - [NextJS](https://nextjs.org/)
- HTML/CSS
- PostgreSql (Database)
- Git

## Learning Resources

- Codecademy
  - [HTML/CSS](https://www.codecademy.com/catalog/language/html-css)
  - [JavaScript + ReactJS](https://www.codecademy.com/catalog/language/javascript)
- FreeCodeCamp
  - [HTML/CSS/JavaScript](https://learn.freecodecamp.org/)
- [NextJS](https://nextjs.org/learn/)
- [PostgreSQL](https://pgexercises.com/)
- [Learn Git with Atlassian](https://www.atlassian.com/git)

## Install

1.  Install [NodeJS](https://nodejs.org/en/)

2.  Install [Yarn](https://yarnpkg.com/lang/en/docs/install/)

3.  Install (PostgreSQL)[https://www.postgresql.org/download/]

4.  Navigate to project folder in cmd/terminal and run

```
yarn
```

## Usage

```
yarn db-all
yarn dev
```

## Deployment

```
yarn start
```

## TODO

- Move database to cloud (AWS) to avoid dealing with backups
- Fix UI issues on all devices (ios, android, macOS, windows) and browsers (firefox, chrome, safari)

## Maintainers

[@gpng](https://github.com/gpng)

## Contribute

PRs accepted.

Small note: If editing the README, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

MIT © 2018 Gerald Png
