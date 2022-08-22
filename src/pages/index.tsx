import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  FormErrorMessage,
} from '@chakra-ui/react';
import type { GetServerSideProps, NextPage } from 'next';
import { useAuth } from '../hook/useAuth';
import { useForm } from 'react-hook-form';
import { loginSchema } from '../validation/schema';
import { yupResolver } from '@hookform/resolvers/yup';
import { Credentials } from '../interface/login';
import { parseCookies } from 'nookies';

const Home: NextPage = () => {
  const { signIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Credentials>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: Credentials) => {
    await signIn(data);
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

          <Button type="submit" mt="6" colorScheme="pink">
            Entrar
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Home;

// Verifica se tem token, se tiver ele ja redireciona para a home
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = parseCookies(ctx);

  if (cookies.token) {
    return {
      redirect: {
        destination: '/home',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
