import express from 'express';
import {v4 as uuidV4 } from 'uuid';
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

app.post('/api/tickets/:id/clone', (req, res) => {
    let newTicket;
    const ticket = tempData.filter(ticket => ticket.id === req.params.id)
    if (ticket) {
        newTicket = JSON.parse(JSON.stringify(ticket[0]));
        newTicket.id = uuidV4();
        tempData.push(newTicket);
    }
    if(newTicket) {
        res.send(newTicket);
    }else {
        res.status(500);
        res.send('Failed to find ticket to clone');
    }
});

app.listen(serverAPIPort);
console.log('server running', serverAPIPort)
