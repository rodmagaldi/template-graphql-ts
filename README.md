# template-graphql-ts

## Description

Template nodejs GraphQL [Apollo server](https://www.apollographql.com/docs/apollo-server/). [PostgreSQL](https://www.postgresql.org/about/) database managed by [typeORM](https://typeorm.io/#/) runs on a [docker](https://www.docker.com/) container.

## Environment and tools

- Typescript
- nodeJS
- apollo-server
- typeORM
- docker
- PostgreSQL

Dev Tools:

- [ESLint](https://www.npmjs.com/package/eslint)
- [Prettier](https://www.npmjs.com/package/prettier)

## Steps to run and debug

In order to run this project, **first** check if you have **nodeJS** properly installed on your machine by typing `node -v` into a terminal. Also make sure your **docker** instalation is OK by typing `docker -v`.

1. Clone the project. `git clone <repo uri>`
2. Install the dependencies. `yarn`
3. Run `docker-compose up -d` on the root folder to start the container in detached mode.
4. Type `yarn dev:server` to run the server. Auto-reload is on (with ts-node-dev).

To perform the tests, run `yarn dev:test`
