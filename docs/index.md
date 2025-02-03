---
title: Welcome to arpc
forward: /getting-started
---

arpc is a framework to build RPC services with the ability to scaffold authentication/ratelimiting easily and prevent API breakages with a simple CLI based versioning system with built in CI support. The server supports the following frameworks:

- Next
- Nuxt
- SvelteKit
- SolidStart

The idea of it is to integrate with your project structure, with code generation for clients in many languages with the CLI. Additionally, the interfaces for RPC services are defined in a way that they support atomicity and a clean API layout:

```ts
const client = new APIV1Client();

const user = await client.users.get(1);
// ^ returns a user object, notice the clean, namespaced API here.
```

There are 3 main principles within this RPC framework which help it stand out over other RPC solutions:

## Atomicity

The API supports atomicity. Implementing this server side is trivial:

```ts
// inside your RPC service...
const tx = useDatabaseTransaction(db.transaction);
// ^ takes a function or Promise that returns a object with a `rollback` and `commit` method.
```

If any of the functions inside the atomic block fail, the transaction will roll back. [There are several other hooks, see the docs for more.](/server/hooks)

Atomics also have a nice to use and clean API on clients. See [atomic clients](/client/atomics):

```ts
const [, posts] = await client.atomic((client, { variable, eq, pluck }) => {
    const resultVar = variable<{userId: string}>("resultVar");

    return [
        // Call users.changeSignature and put the result into resultVar - if this fails, it will roll back.
        resultVar.set(client.users.changeSignature({
            signature: "Hello, world!",
        })),

        // Call posts.getAll with the userId from resultVar
        client.posts.getAll({
            userId: pluck(resultVar, "userId"),
        }),
    ] as const;
});
```

There is additionally a dedupe function (which works like React's cache function) for non-mutations you may want to repeat several times within a block of atomic requests:

```ts
export const getWeather = dedupe(async (location: string) => {
    // Your expensive compute here... only runs once per atomic set of requests
})
```

## Stacked API's

When we make a breaking change to an API, we should push a new release. This is obvious, but yet so many people forget to do this. It's an easy mistake to make but with potentially application breaking consequences.

The way this works is say you have an API V1 which has a bunch of functions. You probably don't want to have to manually copy each API, so instead when you call `arpc versions bump`, it will go ahead and create a stack. This means that when you want to break a method within your API, you can use `arpc methods break my.function`, and it will go ahead and create a copy (in this example, to `rpc/routes/<version>/my/function.ts`).

This also makes review much easier because the expectation of when the new files will be created is very clear.

## Support for simpler return types

A lot of frameworks such as gRPC require you to return a full struct even when one is not rquired. The end result of this is you have clients that have a lot of bloat built into them since you have to carry a lot of useless response objects and cannot share objects in a simple clean way. arpc does away with this, making the objects its own simple separate things and allowing you to return a boolean or a string, for example:

```ts
const isSubscribed = await client.subscriptions.isSubbed("astrid");
// ^ this is a boolean
```
