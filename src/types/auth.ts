import { DefaultSession } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      username: string;
      role: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    username: string;
    role: string;
    email: string;
    name?: string;
    image?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    username: string;
    role: string;
  }
}
