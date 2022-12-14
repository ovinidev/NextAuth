import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  FormErrorMessage,
} from '@chakra-ui/react';
import type { NextPage } from 'next';
import { useAuth } from '../hook/useAuth';
import { useForm } from 'react-hook-form';
import { loginSchema } from '../validation/schema';
import { yupResolver } from '@hookform/resolvers/yup';
import { Credentials } from '../interface/login';
import { withSSRGuest } from '../utils/withSSRGuest';
import { useMutation } from '@tanstack/react-query';

const Home: NextPage = () => {
  const { signIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Credentials>({
    resolver: yupResolver(loginSchema),
  });

  const { error, isLoading, isSuccess, mutateAsync } = useMutation(
    async (data: Credentials) => {
      await signIn(data);
    },
  );

  const onSubmit = async (data: Credentials) => {
    await mutateAsync(data);
  };

  return (
    <Flex h="100vh">
      <Flex w="40%" bg="pink.500" />

      <Flex width="60%" bg="gray.800" justify={'center'} align="center">
        <Flex
          w={400}
          direction="column"
          as="form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Stack spacing="4">
            <FormControl isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input type="email" {...register('email')} />
              {errors && (
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={!!errors.password}>
              <FormLabel>Senha</FormLabel>
              <Input type="password" {...register('password')} />
              {errors && (
                <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
              )}
            </FormControl>
          </Stack>

          <Button type="submit" mt="6" colorScheme="pink" isLoading={isLoading}>
            Entrar
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Home;

export const getServerSideProps = withSSRGuest(async () => {
  return {
    props: {},
  };
});
