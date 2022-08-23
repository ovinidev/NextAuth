import { Button, Flex, Heading } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { getUserData } from '../api';
import { useAuth } from '../hook/useAuth';
import { withSSRAuthenticated } from '../utils/withSSRAuthenticated';

export default function Editor() {
  return (
    <Flex>
      <Heading>Editor</Heading>
    </Flex>
  );
}

export const getServerSideProps = withSSRAuthenticated(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    role: 'editor',
  },
);
