import { Button, Flex, Heading } from '@chakra-ui/react';
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
