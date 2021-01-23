import React from 'react';
import './App.scss';
import { createApiClient, Ticket } from './api';

export type AppState = {
  tickets?: Ticket[],
  search: string;
  darkMode: boolean;
}

const api = createApiClient();

export class App extends React.PureComponent<{}, AppState> {

  state: AppState = {
    search: '',
    darkMode: false
  }

  searchDebounce: any = null;

  async componentDidMount() {
    this.setState({
      tickets: await api.getTickets()
    });
  }

  renderDarkModeCheckbox = () => {
    return (<div>

      <button onClick={() => {
        this.setState({
          darkMode: !this.state.darkMode
        })
      }}>
        {this.state.darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
    </div>);
  }

  renderTickets = (tickets: Ticket[]) => {

    const filteredTickets = tickets
      .filter((t) => (t.title.toLowerCase() + t.content.toLowerCase()).includes(this.state.search.toLowerCase()));


    return (<ul className='tickets'>
      {filteredTickets.map((ticket) => (<li key={ticket.id} className='ticket'>
        <h5 className='title'>{ticket.title}</h5>
        <footer>
          <div className='meta-data'>By {ticket.userEmail} | {new Date(ticket.creationTime).toLocaleString()}</div>
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
    const { tickets, darkMode } = this.state;
    document.body.className = darkMode ? 'darkMode' : '';
    return (<main>
      {this.renderDarkModeCheckbox()}
      <h1>Tickets List</h1>
      <header>
        <input type="search" placeholder="Search..." onChange={(e) => this.onSearch(e.target.value)}/>
      </header>
      {tickets ? <div className='results'>Showing {tickets.length} results</div> : null}
      {tickets ? this.renderTickets(tickets) : <h2>Loading..</h2>}
    </main>)
  }
}

export default App;
