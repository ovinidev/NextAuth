import { useToast } from '@chakra-ui/react';

type ToastingProps = {
  toastSuccessLogin: () => void;
  toastFailedLogin: (description: string) => void;
  toastGenericError: (title: string, description: string) => void;
};

export const useToasting = (): ToastingProps => {
  const toast = useToast();

  const toastSuccessLogin = () => {
    toast({
      title: 'Sucesso ao entrar',
      description: 'Login feito com sucesso',
      status: 'success',
      duration: 2000,
      isClosable: true,
      position: 'top-right',
    });
  };

  const toastFailedLogin = (description: string) => {
    toast({
      title: 'Erro ao fazer login',
      description: description,
      status: 'error',
      duration: 2000,
      isClosable: true,
      position: 'top-right',
    });
  };

  const toastGenericError = (title: string, description: string) => {
    toast({
      title: title,
      description: description,
      status: 'error',
      duration: 2000,
      isClosable: true,
      position: 'top-right',
    });
  };

  return {
    toastSuccessLogin,
    toastFailedLogin,
    toastGenericError,
  };
};
