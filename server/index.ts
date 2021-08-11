import express from 'express';
import bodyParser = require('body-parser');
import { tempData } from './temp-data';
import { serverAPIPort, APIPath } from '@fed-exam/config';
import { readFileSync, writeFileSync } from 'fs';

console.log('starting server', { serverAPIPort, APIPath });

const app = express();

const PAGE_SIZE = 20;

app.use(bodyParser.json());

const getUpdatedServerData = () => {
  return JSON.parse(readFileSync('./data.json', 'utf8'))
}

app.use('*', (_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,GET,PUT');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

app.options('*', (_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,GET,PUT');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.send('ok');
});

app.get(APIPath, (req, res) => {

  // @ts-ignore
  const page: number = req.query.page || 1;

  const paginatedData = tempData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  res.send(paginatedData);
});

app.put(`${APIPath}/:id/priority`, (req, res) => {

  // @ts-ignore
  const newTickets = JSON.parse(readFileSync('./data.json', 'utf8'))
    .map((t: any) => t.id === req.params.id ? {...t, priority: req.body.priority} : t);
  

  writeFileSync('./data.json', JSON.stringify(newTickets, null, 4), 'utf8');

  res.send('ok');
});

app.listen(serverAPIPort);
console.log('server running', serverAPIPort)

