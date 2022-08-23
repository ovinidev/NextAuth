import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next';
import { destroyCookie, parseCookies } from 'nookies';
import { AuthTokenError } from '../errors/AuthTokenError';
import decode from 'jwt-decode';

interface Role {
  role?: string;
}

// Função que não permite o usuário acessar página logado
export function withSSRAuthenticated<P>(
  fn: GetServerSideProps<P>,
  role = '' as Role,
) {
  return async (
    ctx: GetServerSidePropsContext,
  ): Promise<GetServerSidePropsResult<P>> => {
    const { token } = parseCookies(ctx);

    if (!token) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    if (token) {
      const { roles } = decode<{ roles: string[] }>(token);

      if (role) {
        if (roles[0] !== role.role) {
          return {
            redirect: {
              destination: '/home',
              permanent: false,
            },
          };
        }
      }
    }

    try {
      return await fn(ctx);
    } catch (err) {
      if (err instanceof AuthTokenError) {
        destroyCookie(ctx, 'token');
        destroyCookie(ctx, 'refreshToken');

        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        };
      }

      return {
        redirect: {
          destination: '/404',
          permanent: false,
        },
      };
    }
  };
}
