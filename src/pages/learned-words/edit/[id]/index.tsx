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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getLearnedWordById, updateLearnedWordById } from 'apiSdk/learned-words';
import { Error } from 'components/error';
import { learnedWordValidationSchema } from 'validationSchema/learned-words';
import { LearnedWordInterface } from 'interfaces/learned-word';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { FlashCardInterface } from 'interfaces/flash-card';
import { UserInterface } from 'interfaces/user';
import { getFlashCards } from 'apiSdk/flash-cards';
import { getUsers } from 'apiSdk/users';

function LearnedWordEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<LearnedWordInterface>(
    () => (id ? `/learned-words/${id}` : null),
    () => getLearnedWordById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: LearnedWordInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateLearnedWordById(id, values);
      mutate(updated);
      resetForm();
      router.push('/learned-words');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<LearnedWordInterface>({
    initialValues: data,
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
            Edit Learned Word
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
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
    operation: AccessOperationEnum.UPDATE,
  }),
)(LearnedWordEditPage);
