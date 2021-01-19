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
	getTickets: (sort?: Sort) => Promise<Ticket[]>;
}

export type Sort = {
	direction?: SortDirection,
	by: SortCriteria
};

export type SortCriteria = 'title' | 'date' | 'email' ;
export type SortDirection = 'ASC' | 'DESC';

const buildQuery = (sort?: Sort) => {
	return sort && sort.by ? `?sortBy=${sort.by}&sortDir=${sort.direction || `ASC`}`: '';
}

export const createApiClient = (): ApiClient => {
    return {
        getTickets: () => {
            return axios.get(APIRootPath).then((res) => res.data);
        }
    }
	return {
		getTickets: (sort?: Sort) => {
			return axios.get(`http://localhost:3232/api/tickets${buildQuery(sort)}`).then((res) => res.data);
		}
	}
}



