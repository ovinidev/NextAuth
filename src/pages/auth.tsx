import { Flex, Heading } from '@chakra-ui/react';
import { withSSRAuthenticated } from '../utils/withSSRAuthenticated';

export default function Auth() {
  return (
    <Flex>
      <Heading>Olá logado</Heading>
    </Flex>
  );
}

export const getServerSideProps = withSSRAuthenticated(
  async () => {
    return {
      props: {},
    };
  },
  {
    role: 'logado',
  },
);
