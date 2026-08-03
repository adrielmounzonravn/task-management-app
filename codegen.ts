import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'https://syn-api-production-e95c.up.railway.app/graphql',
  documents: ['src/**/*.tsx', 'src/**/*.ts', '!src/gql/**'],
  ignoreNoDocuments: true,
  generates: {
    './src/gql/': {
      preset: 'client',
    },
  },
}

export default config
