---
title: Getting started with arpc
back: /
---

To get started with arpc, you need to init it within a supported framework:

```bash
# cd to your project and then run:

# bun
bunx arpc init
# npm
npx arpc init
```

This will setup the project structure and create the required file structure. 2 mounts will be mounted into your framework:

- `/api/rpc`: This is what will be called by the auto-generated clients.
- `/api/rpc/docs`: Defines the documentation for the RPC API's and also serves as where the arpc CLI pulls the API definitions from to build clients.

## Setup

Once arpc is in the project, we should go to the file serving `/api/rpc/docs` (this is different for each framework and will follow the conventions of the web framework you are using). You will see a `title` and `description` constant. Change these to your liking.

## Development

**For future reference, when we refer to "arpc", we mean "npx arpc" if you are using npm, or "bunx arpc" if you are using Bun.**

The first thing after initialising the project we should do if we want authentication in our API is run `arpc scaffold authentication`. This will scaffold a TypeScript file in which we can define how the authentication will work. We then handle how we want the token to behave:

```ts
// ...

export async function validate(token: string, tokenType: TokenTypes) {
    // TODO: Return your user here.
    return null;
}

// ...
```

From here, any generated code will have a boolean and take in the user from within the scaffold.

After we have scaffolded authentication, we need to create a new API version. To do this, we should run `arpc versions bump`. This will create API V1.

From here, we can run `arpc methods create users.get` to create aa unique API method. It is worth noting that this namespace will be both reflected in the client and server structures (on the client, you will have `client.users.get`, and on the server you will have `rpc/routes/v1/users/get.ts`). The file will contain sane flags within the file that handle all of the following:

- `mutation`: Defines if this route is a mutation. A mutation is an aciton that alters data. Used internally for routing.
- `parallel`: Defines if when in a atomic request if this can run parallel with other request items. If the server processor hits a item where this is false, the whole atomic request will pause whilst this runs.

The result 

When you change an API, you should make sure that you bump the version if you are making breaking changes. The [CI action](#ci-action) will check that you have bumped the version when you have made breaking changes.

## CI Action

You will also notice that the framework made a GitHub Actions workflow inside your application. The way this works is that when you make pull requests, it will check against the `main` branch to ensure that the API has not been broken without a new version being released.
