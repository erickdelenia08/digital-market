// import { DefaultSession } from "next-auth"

// export type ExtendedUser = DefaultSession["user"] & {
//   id: string
//   role: string
//   isTwoFactorEnabled: boolean
// }

// declare module "next-auth" {
//   interface Session {
//     user: ExtendedUser
//     role: string
//   }
// }


import { DefaultSession } from "next-auth"

export type ExtendedUser = DefaultSession["user"] & {
  id: string
  role: string
  isTwoFactorEnabled: boolean
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser
  }

  interface User {
    role?: string
    isTwoFactorEnabled?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
    isTwoFactorEnabled?: boolean
  }
}