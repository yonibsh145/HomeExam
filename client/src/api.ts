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
  getTickets: (s?: string) => Promise<Ticket[]>;
}

export const createApiClient = (): ApiClient => {
  return {
    getTickets: (s = '') => {
      return axios.get(APIRootPath + `?search=${s}`).then((res) => res.data);
    }
  }
}
