import * as yup from 'yup';

export const learnedWordValidationSchema = yup.object().shape({
  word_id: yup.string().nullable(),
  user_id: yup.string().nullable(),
});
