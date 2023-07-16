import axios from 'axios';
import queryString from 'query-string';
import { FlashCardInterface, FlashCardGetQueryInterface } from 'interfaces/flash-card';
import { GetQueryInterface } from '../../interfaces';

export const getFlashCards = async (query?: FlashCardGetQueryInterface) => {
  const response = await axios.get(`/api/flash-cards${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createFlashCard = async (flashCard: FlashCardInterface) => {
  const response = await axios.post('/api/flash-cards', flashCard);
  return response.data;
};

export const updateFlashCardById = async (id: string, flashCard: FlashCardInterface) => {
  const response = await axios.put(`/api/flash-cards/${id}`, flashCard);
  return response.data;
};

export const getFlashCardById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/flash-cards/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteFlashCardById = async (id: string) => {
  const response = await axios.delete(`/api/flash-cards/${id}`);
  return response.data;
};
