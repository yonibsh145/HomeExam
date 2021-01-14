import axios from 'axios';
import {APIRootPath} from '@fed-exam/config';

export type Ticket = {
    id: string,
    title: string;
    content: string;
    creationTime: number;
    userEmail: string;
    labels?: string[];
}

export type ApiClient = {
	getTickets: () => Promise<Ticket[]>;
	renameTicket: (ticketId: string, newTitle: string) => Promise<Ticket>;
}

export const createApiClient = (): ApiClient => {
	return {
		getTickets: () => {
			return axios.get(APIRootPath).then((res) => res.data);
		},
		renameTicket: (ticketId, newTitle) => {
			return axios.put(`${APIRootPath}/${ticketId}/title`, {title: newTitle})
				.then((res) => res.data);
		}
	}
}
