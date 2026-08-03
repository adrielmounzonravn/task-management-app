import { SetContextLink } from '@apollo/client/link/context'

export const authLink = new SetContextLink((prevContext) => ({
  headers: {
    ...prevContext.headers,
    Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
  },
}))
