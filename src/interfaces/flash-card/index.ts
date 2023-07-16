import { LearnedWordInterface } from 'interfaces/learned-word';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface FlashCardInterface {
  id?: string;
  word: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;
  learned_word?: LearnedWordInterface[];
  user?: UserInterface;
  _count?: {
    learned_word?: number;
  };
}

export interface FlashCardGetQueryInterface extends GetQueryInterface {
  id?: string;
  word?: string;
  user_id?: string;
}
