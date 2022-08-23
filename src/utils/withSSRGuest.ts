import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next';
import { parseCookies } from 'nookies';

// Função que não permite o usuário acessar página ja logado
export function withSSRGuest<P>(fn: GetServerSideProps<P>) {
  return async (
    ctx: GetServerSidePropsContext,
  ): Promise<GetServerSidePropsResult<P>> => {
    const { token } = parseCookies(ctx);

    if (token) {
      return {
        redirect: {
          destination: '/home',
          permanent: false,
        },
      };
    }

    return await fn(ctx);
  };
}
