import { readFileSync } from 'fs';

import axios from 'axios';

describe("POST /tickets", () => {

  test('exists and does not return 404', async () => {

    const status = await axios.post('http://localhost:3232/api/tickets', {title: 'bob 222', content: 'sdgfdggdf', userEmail: 'bob@gmail.com'})
      .then((res) => res.status, err => err.response.status);

    expect(status).not.toBe(404);
  });

  test('adds the send payload as a ticket', async () => {
    const newTicket = {title: 'bob 111', content: 'some content', userEmail: 'bob@gmail.com'};
    await axios.post('http://localhost:3232/api/tickets', newTicket)

    const tickets = await axios.get('http://localhost:3232/api/tickets').then((res) => res.data);

    const newTicketFromServer = tickets.find(t => t.title === newTicket.title);

  
    expect(newTicketFromServer.title).toBe(newTicket.title);
    expect(newTicketFromServer.content).toBe(newTicket.content);
    expect(newTicketFromServer.userEmail).toBe(newTicket.userEmail);
  });

  test('created ticket has an id', async () => {
    const newTicket = {title: 'bob 222', content: 'some content', userEmail: 'bob@gmail.com'};
    await axios.post('http://localhost:3232/api/tickets', newTicket)

    const tickets = await axios.get('http://localhost:3232/api/tickets').then((res) => res.data);

    const newTicketFromServer = tickets.find(t => t.title === newTicket.title);

    expect(newTicketFromServer.id).toBeDefined();
  })

  test('created ticket id is a valid guid', async () => {
    const newTicket = {title: 'bob 3333', content: 'some content', userEmail: 'bob@gmail.com'};
    await axios.post('http://localhost:3232/api/tickets', newTicket)

    const tickets = await axios.get('http://localhost:3232/api/tickets').then((res) => res.data);

    const newTicketFromServer = tickets.find(t => t.title === newTicket.title);

    const guidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;


    expect(newTicketFromServer.id).toMatch(guidPattern)
  })

  test('created ticket has a creation time', async () => {
    const newTicket = {title: 'bob 4444', content: 'some content', userEmail: 'bob@gmail.com'};
    await axios.post('http://localhost:3232/api/tickets', newTicket)

    const tickets = await axios.get('http://localhost:3232/api/tickets').then((res) => res.data);
    const newTicketFromServer = tickets.find(t => t.title === newTicket.title);

    expect(typeof newTicketFromServer.creationTime).toBe('number');
  })

  test('bonus - new ticket is returned as the response', async () => {
    const newTicket = {title: 'bob 5555', content: 'some content', userEmail: 'bob@gmail.com'};
    const response = await axios.post('http://localhost:3232/api/tickets', newTicket)
      .then((res) => res.data);

  
    expect(response.title).toBe(newTicket.title);
    expect(response.content).toBe(newTicket.content);
    expect(response.userEmail).toBe(newTicket.userEmail);
  });

  test('bonus - no extra params are returned', async () => {
    const newTicket = {title: 'bob 42', content: 'some content', userEmail: 'bob@gmail.com', extra: 222};
    await axios.post('http://localhost:3232/api/tickets', newTicket)
      .then((res) => res.data);

    const tickets = await axios.get('http://localhost:3232/api/tickets').then((res) => res.data);
    const newTicketFromServer = tickets.find(t => t.title === newTicket.title);

  
    expect(newTicketFromServer.extra).not.toBeDefined();
  });

  test('bonus 2 - API returns 201', async () => {
    const newTicket = {title: 'bob 5555', content: 'some content', userEmail: 'bob@gmail.com'};
    const status = await axios.post('http://localhost:3232/api/tickets', newTicket)
      .then((res) => res.status);

    expect(status).toBe(201);
  });

  test('bonus 3 - data is saved to the json file and not just in memory', async () => {
    const newTicket = {title: 'bob 6666', content: 'some content', userEmail: 'bob@gmail.com'};

    await axios.post('http://localhost:3232/api/tickets', newTicket);
    
    
    const file = readFileSync('../server/data.json', 'utf-8');
    const ticketsInFile = JSON.parse(file);

    const ticketInFile = ticketsInFile.find((t) => t.title === newTicket.title);

    expect(ticketInFile).toBeDefined();
    expect(ticketInFile.title).toBe(newTicket.title);
  });

})