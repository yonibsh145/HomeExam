import axios from 'axios';
import {APIRootPath} from '@fed-exam/config';

export type Ticket = {
    id: string,
    title: string;
    content: string;
    creationTime: number;
    userEmail: string;
    labels?: string[];
    priority?: TicketPriority;
}

export enum TicketPriority  {
    HIGH = 30,
    NORMAL = 20
}

export type ApiClient = {
    getTickets: () => Promise<Ticket[]>;
    updatePriority: (ticketId: string, newPriority: TicketPriority) => Promise<void>;
}

export const createApiClient = (): ApiClient => {
    return {
        getTickets: () => {
            return axios.get(APIRootPath).then((res) => res.data);
        },
        updatePriority: (ticketId: string, newPriority: TicketPriority) => {
            return axios.put(`${APIRootPath}/${ticketId}/priority`, {priority: newPriority});
        }
    }
}
