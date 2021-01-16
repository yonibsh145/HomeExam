import express from 'express';

import bodyParser = require('body-parser');
import { tempData } from './temp-data';
import { writeFileSync } from 'fs';

const app = express();

const PORT = 3232;

const PAGE_SIZE = 20;

app.use(bodyParser.json());

app.use((_, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', '*');
	res.setHeader('Access-Control-Allow-Headers', '*');
	next();
});

app.get('/api/tickets', (req, res) => {

	const page = req.query.page || 1;

	const paginatedData = tempData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
	
	res.send(paginatedData);
});

function uuidv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	  var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
	  return v.toString(16);
	});
}

app.post('/api/tickets', (req, res) => {
	const {title, content, userEmail} = req.body;

	const ticket = {
		title,
		content,
		userEmail,
		id: uuidv4(),
		creationTime: Date.now()
	}
	tempData.unshift(ticket);

	writeFileSync('./data.json', JSON.stringify(tempData), 'utf-8');

	res.status(201).send(ticket);
});

app.listen(PORT);
console.log('server running', PORT)

