import NextAuth from "next-auth/next";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { checkMail, SignIn, SignUp, adminSignIn } from "@/app/utils/apiHandler";


const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email" },
        password: { label: "Password", type: "password", placeholder: "*****" },
      },
      authorize: async (credentials) => {
        const user = {
          email: credentials.email,
          loginType: credentials.loginType,
          password: credentials.password,
        };
        if(credentials.role){
          user.loginType = credentials.loginType
        }
        if(credentials.role == "admin"){
          const res = await adminSignIn(user);
          if (res.code == 1) {
            res.data.role = credentials.role
            console.log("Reponse : ",res.data)
            return res.data; // { id, name, email, jwtToken, etc. }
          } else if (res.code === 2) {
            throw new Error("User Not Registered with this Email!");
          }else if(res.code == 0 && res.keyword == "password not matched"){
            throw new Error("Wrong Password !")
          }else if(res.code == 2 && res.keyword == "email not found"){
            throw new Error("Email Not Exits !")
          } else {
            throw new Error("Something Went Wrong !");
          }
        }else{
          const res = await SignIn(user);
          if (res.code == 1) {
            res.data.role = credentials.role
            console.log("User Response : ",res)
            return res.data; // { id, name, email, jwtToken, etc. }
          } else if (res.code === 2) {
            throw new Error("User Not Registered with this Email!");
          }else if(res.code == 0 && res.keyword == "password not matched"){
            throw new Error("Wrong Password !")
          }else if(res.code == 2 && res.keyword == "Email Not Exits"){
            throw new Error("Email Not Exits !")
          }else {
            throw new Error("Something Went Wrong  !");
          }
        }
      },
    }),

    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: { params: { scope: "read:user user:email" } },
      profile: async (profile, tokens) => {
        let email = profile.email;

        if (!email && tokens?.access_token) {
          const res = await fetch("https://api.github.com/user/emails", {
            headers: {
              Authorization: `token ${tokens.access_token}`,
              Accept: "application/vnd.github.v3+json",
            },
          });

          const data = await res.json();

          if (Array.isArray(data)) {
            const primary = data.find((e) => e.primary && e.verified);
            email = primary?.email || null;
          } else {
            throw new Error("Invalid GitHub email response format");
          }
        }

        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email,
          image: profile.avatar_url,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id || null;
        token.name = user.name;
        token.email = user.email;
        token.avatar_url = user.image || "default.jpg";
        token.username = user.name || "Coderjs";
        token.jwtToken = user.jwtToken || "not found";
        token.role = user.role || "none";
      }

      if (account?.provider === "github" && profile) {
        token.username = profile.login;
        token.avatar_url = profile.avatar_url;
      } else if (account?.provider === "google" && profile) {
        console.log("Email : ",token.email)
        const emailCheck = await checkMail({email : token.email})
        console.log("Account : ",emailCheck)
        if (emailCheck.code == 1) {
          const signInData = {
            email: token.email,
            social_id: token.id,
            loginType: "G"
          };
          console.log("This is Data : ",signInData)
          const signInResult = await SignIn(signInData);
        
          if (signInResult.code == 1) {
            signInResult.data.role = "user";
            return signInResult.data;
          } else if (signInResult.code == 2) {
            throw new Error("User Not Registered with this Email!");
          } else if(signInResult.code == 0 && signInResult.data.keyword == "password not matched"){
            throw new Error("Wrong Password !")
          }else {
            throw new Error("Something Went Wrong During Sign In!");
          }
        }
        else {
          const signUpData = {
            email: token.email,
            name: token.username,
            social_id: user.id,
            loginType: "G",
          };
          const signUpResult = await SignUp(signUpData);
        
          if (signUpResult.code != 1) {
            throw new Error("Signup Failed! Please try again.");
          }
        }
        

        token.username = profile.email?.split("@")[0];
        token.name = profile.email?.split("@")[0];
        token.avatar_url = profile.picture;
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.accessToken = token.accessToken;
      session.user.username = token.username;
      session.user.avatar_url = token.avatar_url;
      session.user.email = token.email;
      session.user.jwtToken = token.jwtToken || "not found";
      session.user.role = token.role;
      return session;
    },
  },
};

// ✅ Export here AFTER defining authOptions
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
