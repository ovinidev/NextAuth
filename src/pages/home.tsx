import { Button, Flex, Heading } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import { getUserDataClient } from '../api';
import { useAuth } from '../hook/useAuth';

export default function Home() {
  const { accountInfo, singOut } = useAuth();

  const { data, error } = useQuery(
    ['data'],
    async () => {
      const data = await getUserDataClient();

      return data;
    },
    {
      staleTime: 1000 * 5,
    },
  );

  return accountInfo.isAuthenticated ? (
    <Flex>
      {error ? (
        <Heading>Deu erro</Heading>
      ) : (
        <Flex direction={'column'}>
          <Heading>Olá {data?.email}</Heading>
          <Heading>Olá {data?.roles[0]}</Heading>
        </Flex>
      )}

      <Button colorScheme={'linkedin'} onClick={singOut}>
        LOGOUT
      </Button>
    </Flex>
  ) : (
    <Flex></Flex>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { token, refreshToken } = parseCookies(ctx);

  if (!token || !refreshToken) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  // const axiosInstance = setupApiClient(ctx);
  // const { data } = await axiosInstance.get<UserInfoByToken>('me');

  return {
    props: {},
  };
};
