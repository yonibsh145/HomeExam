import axios from 'axios';
import { APIRootPath } from '@fed-exam/config';

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
  cloneTicket: (id: string) => Promise<Ticket>;
}

export const createApiClient = (): ApiClient => {
  return {
    getTickets: () => {
      return axios.get(APIRootPath).then((res) => res.data);
    },
    cloneTicket: (id: string) => {
      return axios.post(`${APIRootPath}/${id}/clone`).then((res) => res.data);
    }
  }
}



