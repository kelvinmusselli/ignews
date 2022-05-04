import { query as q } from 'faunadb';

import NextAuth from 'next-auth';

import GithubProvider from 'next-auth/providers/github';

import { fauna } from '../../../services/fauna';

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks:{
    async signIn({ user: { email } }) {
      const isAllowedToSignIn = true
      if (isAllowedToSignIn) {
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index('user_by_email'),
                  q.Casefold(email)
                )
              )
            ), // a partir daqui é dentro do if
            q.Create(
              q.Collection('users'), {
                data: { email }
              }
            ), // a partir daqui é dentro do else
            q.Get(
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(email)
              )
            )
          )
          // q.Create( // salva no db
          //   q.Collection('users'), {
          //     data: { email }
          //   }
          // )
        )
        return true;
      } else {
        return false;
      }
    }
  }
});
