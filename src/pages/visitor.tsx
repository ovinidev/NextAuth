import { Flex, Heading } from '@chakra-ui/react';
import { withSSRGuest } from '../utils/withSSRGuest';

export default function Page() {
  return (
    <Flex>
      <Heading>Olá visitante</Heading>
    </Flex>
  );
}

export const getServerSideProps = withSSRGuest(async () => {
  return {
    props: {},
  };
});
