// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// // import AppleProvider from "next-auth/providers/apple";
// import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
// import clientPromise from "../../../../lib/mongodb";
// import dbConnect from "../../../../lib/dbConnect"; 
// import User from "../../../../Model/Userschema";

// export const authOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     })
//     // AppleProvider({
//     //   clientId: process.env.APPLE_CLIENT_ID,
//     //   clientSecret: process.env.APPLE_CLIENT_SECRET,
//     // }),
//   ],
//   adapter: MongoDBAdapter(clientPromise), // to use sessions

//   callbacks: {
//     async signIn({ user, account }) {
//       await dbConnect(); // connect mongoose

//       const existing = await User.findOne({ providerAccountId: account.providerAccountId });

//       if (!existing) {
//         await User.create({
//           name: user.name,
//           email: user.email,
//           profilePic: user.image,
//           provider: account.provider,
//           providerAccountId: account.providerAccountId,
//         });
//       }

//       return true;
//     },

//     async session({ session, token }) {
//       const User = await User.findOne({ email: session.user.email });

//       if (User) {
//         session.user._id = User._id;
//         session.user.role = User.role;
//       }

//       return session;
//     },
//   },
//   session: {
//     strategy: "jwt",
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };

// export default NextAuth(authOptions);

import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import AppleProvider from "next-auth/providers/apple"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })

  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token
        token.provider = account.provider
      }
      return token
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token and user id from a provider.
      session.accessToken = token.accessToken
      session.provider = token.provider
      return session
    },
    async signIn({ user, account, profile, email, credentials }) {
        console.log("user",user)
      // You can add custom logic here for user verification
      // For example, check if user exists in your database
      return true
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
