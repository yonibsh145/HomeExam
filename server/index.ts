import express from 'express';
import bodyParser = require('body-parser');
import { tempData } from './temp-data';
import { serverAPIPort, APIPath } from '@fed-exam/config';

console.log('starting server', { serverAPIPort, APIPath });

const app = express();

const PAGE_SIZE = 20;

app.use(bodyParser.json());

app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

app.get(APIPath, (req, res) => {

  // @ts-ignore
  const page: number = req.query.page || 1;

  const paginatedData = tempData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  res.send(paginatedData);
});

// rename bonus part
app.put('/api/tickets/:ticketId/title', (req, res) => {
  const { ticketId } = req.params;

  const index = tempData.findIndex((ticket) => ticket.id === ticketId);

  if (index !== -1) {
    tempData[index].title = req.body.title;
    res.send(tempData[index]);
  } else {
    res.send(404);
  }
});

app.listen(serverAPIPort);
console.log('server running', serverAPIPort)

