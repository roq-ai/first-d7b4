import { FlashCardInterface } from 'interfaces/flash-card';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface LearnedWordInterface {
  id?: string;
  word_id?: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  flash_card?: FlashCardInterface;
  user?: UserInterface;
  _count?: {};
}

export interface LearnedWordGetQueryInterface extends GetQueryInterface {
  id?: string;
  word_id?: string;
  user_id?: string;
}
