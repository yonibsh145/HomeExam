import React from 'react';
import './App.scss';
import {createApiClient, Ticket} from './api';

export type AppState = {
	tickets?: Ticket[],
	search: string;
	textSize: textSize;
}

type textSize = 'small' |'normal' | 'large';

const api = createApiClient();

export class App extends React.PureComponent<{}, AppState> {

	state: AppState = {
		search: '',
		textSize: 'normal'
	}

	searchDebounce: any = null;

	async componentDidMount() {
		this.setState({
			tickets: await api.getTickets()
		});
	}

	setTextSize(size: textSize) {
		this.setState({
			textSize: size
		});
	}

	renderTextSize = () => {
		return (<div className='fontSize'>
					{this.renderTextButton('small')}
					{this.renderTextButton('normal')}
					{this.renderTextButton('large')}
				</div>);
	}

	renderTextButton = (size: textSize ) => {
		const { textSize } = this.state;
		return(
			<button id={size} disabled={ textSize === size } onClick={() => this.setTextSize(size) }>{`${size} font`}</button>
		);
	}

	renderTickets = (tickets: Ticket[], textSize: textSize) => {

		const filteredTickets = tickets
			.filter((t) => (t.title.toLowerCase() + t.content.toLowerCase()).includes(this.state.search.toLowerCase()));

		const ticketClass = `ticket ${textSize}`;

		return (<ul className='tickets'>
			{filteredTickets.map((ticket) => (<li key={ticket.id} className={ticketClass}>
				<h5 className='title'>{ticket.title}</h5>
				<footer>
					<div className='meta-data'>By {ticket.userEmail} | { new Date(ticket.creationTime).toLocaleString()}</div>
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
		const {tickets, textSize} = this.state;

		return (<main>
			{this.renderTextSize()}
			<h1>Tickets List</h1>
			<header>
				<input type="search" placeholder="Search..." onChange={(e) => this.onSearch(e.target.value)}/>
			</header>
			{tickets ? <div className='results'>Showing {tickets.length} results</div> : null }
			{tickets ? this.renderTickets(tickets, textSize) : <h2>Loading..</h2>}
		</main>)
	}
}

export default App;
