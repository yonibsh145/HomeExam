import React from 'react';
import './App.scss';
import {createApiClient, Ticket, TicketPriority} from './api';

export type AppState = {
	tickets?: Ticket[],
	search: string;
}

const api = createApiClient();

const prioritiesMap = {
	20: 'Normal',
	30: 'High'
}
export class App extends React.PureComponent<{}, AppState> {

	state: AppState = {
		search: ''
	}

	searchDebounce: any = null;

	async componentDidMount() {
		this.setState({
			tickets: await api.getTickets()
		});
	}

	onToggleTicketPriority = (ticket: Ticket) => {
		const {tickets} = this.state;
		if (!tickets) {
			return;
		}
		const newPriority = ticket.priority === TicketPriority.HIGH ? TicketPriority.NORMAL : TicketPriority.HIGH;
		const newTickets = tickets.map(t => t.id === ticket.id ? {...ticket, priority: newPriority} : t);
		this.setState({tickets: newTickets});

		api.updatePriority(ticket.id, newPriority);
	}

	renderTickets = (tickets: Ticket[]) => {

		const filteredTickets = tickets
			.filter((t) => (t.title.toLowerCase() + t.content.toLowerCase()).includes(this.state.search.toLowerCase()));


		return (<ul className='tickets'>
			{filteredTickets.map((ticket) => (<li key={ticket.id} className='ticket'>
				<h5 className='title'>{ticket.title}</h5>
				<footer>
					<div className='meta-data'>By {ticket.userEmail} | { new Date(ticket.creationTime).toLocaleString()}</div>
					<span onClick={() => this.onToggleTicketPriority(ticket)}>{prioritiesMap[ticket.priority || 20]}</span>
				</footer>
			</li>))}
		</ul>);
	}

	onSearch = async (val: string, newPage?: number) => {
		
		clearTimeout(this.searchDebounce);

		this.searchDebounce = setTimeout(async () => {
			this.setState({
				search: val
			});
		}, 300);
	}

	render() {	
		const {tickets} = this.state;

		return (<main>
			<h1>Tickets List</h1>
			<header>
				<input type="search" placeholder="Search..." onChange={(e) => this.onSearch(e.target.value)}/>
			</header>
			{tickets ? <div className='results'>Showing {tickets.length} results</div> : null }	
			{tickets ? this.renderTickets(tickets) : <h2>Loading..</h2>}
		</main>)
	}
}

export default App;