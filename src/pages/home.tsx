import { Button, Flex, Heading } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import { setHeadersToken } from '../api';
import { useAuth } from '../hook/useAuth';

export default function Home() {
  const { accountInfo, singOut } = useAuth();

  return accountInfo.isAuthenticated ? (
    <Flex>
      <Heading>Olá</Heading>
      <Button colorScheme={'linkedin'} onClick={singOut}>
        LOGOUT
      </Button>
    </Flex>
  ) : (
    <Flex></Flex>
  );
}

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const axiosInstance = setupApiClient(ctx);
//   const { data } = await axiosInstance.get('me');

//   return {
//     props: { data },
//   };
// };
