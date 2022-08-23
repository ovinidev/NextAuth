import { Button, Flex, Heading } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { getUserData } from '../api';
import { useAuth } from '../hook/useAuth';
import { withSSRAuthenticated } from '../utils/withSSRAuthenticated';

export default function Home() {
  const { accountInfo, singOut } = useAuth();

  const { data, error } = useQuery(
    ['data'],
    async () => {
      const data = await getUserData();
      return data;
    },
    { staleTime: 1000 * 5 },
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

export const getServerSideProps = withSSRAuthenticated(async (ctx) => {
  // const axiosInstanceSSR = requestsWithSSR(ctx);
  // const { data } = await axiosInstanceSSR.get<UserInfoByToken>('me');

  return {
    props: {},
  };
});
