# Webble

## Build super-powered conversational forms

Webble allows you to build conversational forms in-lieu of traditional forms. Conversational forms are useful because they are engaging and increases conversion. They have a wide range of applications such as customer support, feedback collection and, surveys to name a few.

## The Technology

Webble was built for the EdgeDB hackathon in 2024.
It leverages various technologies such as EdgeDB for data persistence and remix for the frontend. Webble's deployment target is vercel. It also leverages turborepo.

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `web`: A [Remix](https://remix.run/) app
- `renderer`: A [Svelte](https://svelte.dev/) app for rendering the chat UI
- `@webble/elements`: Library with utils for managing and registering new webble chat elements

## Running the Application

To run the application:

### Setup

1. Check that you are on node 19 or later
2. If you
3. You have edgedb setup. Check the [EdgeDB Quickstart Guide](https://docs.edgedb.com/get-started/quickstart) if you don't have edgedb installed locally.
4. Head into the directory `apps>web` and run the `edgedb project init`
5. This repository uses PNPM workspaces with turbo repo, for dependency management,
   ensure you have pnpm installed.
6. Head into `apps>web` and run `cp env.example .env` to create the base env file. Run through it and update any variable you see fit.

### Build

To head to the root of the project directory and build all apps and packages with the following command:

```
pnpm build
```

### Develop

To develop all apps and packages, run the following command in the project root directory:

```
pnpm dev
```

## Useful Links

- [EdgeDB Docs](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Remix Docs](https://turbo.build/repo/docs/core-concepts/caching)
