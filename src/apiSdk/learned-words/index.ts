import axios from 'axios';
import queryString from 'query-string';
import { LearnedWordInterface, LearnedWordGetQueryInterface } from 'interfaces/learned-word';
import { GetQueryInterface } from '../../interfaces';

export const getLearnedWords = async (query?: LearnedWordGetQueryInterface) => {
  const response = await axios.get(`/api/learned-words${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createLearnedWord = async (learnedWord: LearnedWordInterface) => {
  const response = await axios.post('/api/learned-words', learnedWord);
  return response.data;
};

export const updateLearnedWordById = async (id: string, learnedWord: LearnedWordInterface) => {
  const response = await axios.put(`/api/learned-words/${id}`, learnedWord);
  return response.data;
};

export const getLearnedWordById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/learned-words/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteLearnedWordById = async (id: string) => {
  const response = await axios.delete(`/api/learned-words/${id}`);
  return response.data;
};
