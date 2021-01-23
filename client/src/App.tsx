import React from 'react';
import './App.scss';
import {createApiClient, Ticket, Sort, SortDirection, SortCriteria} from './api';

export type AppState = {
    tickets?: Ticket[],
    search: string;
    sort?: Sort
}

const api = createApiClient();

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

    renderSort = () => {
        const {sort} = this.state;
        const sortBy = sort && sort.by;
        const direction = (sort && sort.direction) || '';
        return (
            <div className='sort'>
                {this.renderSortButton('Sort By Title', 'title', sortBy)}
                {this.renderSortButton('Sort By Date', 'date', sortBy)}
                {this.renderSortButton('Sort By Email', 'email', sortBy)}
                <label id='sort-direction'>{ direction ? (direction === 'ASC' ? ' Ascending' : ' Descending') : '' }</label>
            </div>
        );
    }

    renderSortButton = (text: string, criteria: SortCriteria, currentSortBy: SortCriteria | undefined) => {
        return <button className={criteria === currentSortBy ? 'selected' : ''} id={`sort-${criteria}`}
                       onClick={() => {this.getSortedItems({by: criteria})} }>{text}</button>;
    }

    getSortedItems = async (sortData: Sort) => {
        const {sort} = this.state;
        if ((sort && sort.by) === sortData.by) {
            sortData.direction = (sort && sort.direction) === 'ASC' ? 'DESC' : 'ASC';
        } else {
            sortData.direction = 'ASC';
        }
        const tickets = await api.getTickets(sortData);
        this.setState({
            tickets,
            sort:sortData
        });
    }

    renderTickets = (tickets: Ticket[]) => {

        const filteredTickets = tickets
            .filter((t) => (t.title.toLowerCase() + t.content.toLowerCase()).includes(this.state.search.toLowerCase()));


        return (<ul className='tickets'>
            {filteredTickets.map((ticket) => (<li key={ticket.id} className='ticket'>
                <h5 className='title'>{ticket.title}</h5>
                <footer>
                    <div
                        className='meta-data'>By {ticket.userEmail} | {new Date(ticket.creationTime).toLocaleString()}</div>
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
            {this.renderSort()}
            {tickets ? <div className='results'>Showing {tickets.length} results</div> : null}
            {tickets ? this.renderTickets(tickets) : <h2>Loading..</h2>}
        </main>)
    }
}

export default App;
