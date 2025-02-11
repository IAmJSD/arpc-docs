---
layout: "@/layouts/DocsLayout.astro"
title: Atomic Structure
description: How atomic requests work on the server side.
next: /docs/server/hooks
---

arpc supports both atomic and non-atomic requests. When a client is generated, it includes a special `atomic` function in its root that is used to draw atomic requests and send them to the server (see [the client docs](/docs/client/atomics) for more). arpc will automatically use a GET or POST request depending on if all the calls in a request are non-mutations or not.

Atomic requests do come at a tradeoff: the individual request will be slower. However, this can be offset by efficient deduping and also means that you do not need to worry about multiple invocations of the API. Additionally, it allows the user to specify guard rails since you can cause the actions of all calls in the block to be rolled back if any of them fail. This means that users can easily do "if this doesn't succeed, roll back all the changes made in this block".

None of this should affect how you write RPC methods too much. You will want to use [hooks](/docs/server/hooks) to create things like database transactions where any failure in other calls affects the entire atomic request, but you don't need to worry about structuring for specifically one type or the other since the router handles that for you. Calling a hook in a non-atomic request will work as expected.

## Variables and Plucking

How this works depends on your client, see [the client support page](/docs/client/support) for more information, but arpc allows you to store values into variables and then pluck out keys from the object. For example, in the TypeScript client, this would look like this:

```ts
const value = variable<string>("value");

// ...

return [
    value.set(pluck(client.memes.get(1), "name")),
    // ...
];
```

## Branching

In an effort to further reduce required requests and allow for atomicity in more cases, arpc supports branching based on conditions relating to what is previously set in a variable or from a static value. How this is structured depends on your client, see [the client support page](/docs/client/support) for more information. The following types of branching are supported:

- `eq` - Branch based on if the variable is equal to a static value.
- `neq` - Branch based on if the variable is not equal to a static value.
- `gt` - Branch based on if the variable is greater than a static value.
- `gte` - Branch based on if the variable is greater than or equal to a static value.

## Parallelism

When you make an RPC function, you will notice a `parallel` flag in the file. The way calls work in an atomic request is the following:

- All calls with the `parallel` flag before one that is false will be called together.
- Any branch or call that is non-parallel will be called after the previous ones have finished.

This means that when you branch, you should be aware this will not be parallel. This is because the result is needed from the previous call to determine how to branch, and order cannot be guaranteed without knowing the result of the previous call.
