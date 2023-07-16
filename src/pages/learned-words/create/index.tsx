import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createLearnedWord } from 'apiSdk/learned-words';
import { Error } from 'components/error';
import { learnedWordValidationSchema } from 'validationSchema/learned-words';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { FlashCardInterface } from 'interfaces/flash-card';
import { UserInterface } from 'interfaces/user';
import { getFlashCards } from 'apiSdk/flash-cards';
import { getUsers } from 'apiSdk/users';
import { LearnedWordInterface } from 'interfaces/learned-word';

function LearnedWordCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: LearnedWordInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createLearnedWord(values);
      resetForm();
      router.push('/learned-words');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<LearnedWordInterface>({
    initialValues: {
      word_id: (router.query.word_id as string) ?? null,
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: learnedWordValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Learned Word
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <AsyncSelect<FlashCardInterface>
            formik={formik}
            name={'word_id'}
            label={'Select Flash Card'}
            placeholder={'Select Flash Card'}
            fetcher={getFlashCards}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.word}
              </option>
            )}
          />
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'learned_word',
    operation: AccessOperationEnum.CREATE,
  }),
)(LearnedWordCreatePage);
