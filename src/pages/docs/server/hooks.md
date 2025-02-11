---
layout: "@/layouts/DocsLayout.astro"
title: Server Hooks
description: Server hooks are a way to hook into the atomic lifecycle of a request.
back: "/docs/server/atomics"
next: "/docs/server/exceptions"
---

As mentioned previously, server hooks are used to hook into the atomic lifecycle of a request (with the same behaviour when the request isn't atomic). Hooks can be used in any part of the request handling (including middleware). Here are the various hooks you can use:

## `useRequest`

When used inside of a request, will return the `Request` object used to make the request:

```ts
const request = useRequest();
// ^ Request
```

This is useful for things like ratelimiting or getting user information from the request as part of your API flow.

## `useContext`

Returns a `Map<any, any>` object that you can use to persist data between calls in your atomic request:

```ts
const context = useContext();
// ^ Map<any, any>

context.set("foo", "bar");

// In another call in the same atomic request:

const foo = context.get("foo");
// ^ "bar"
```

## `useCommit`

Defines an async function that will be called after all the calls in the request have been made if they were successful:

```ts
// In your RPC function:

useCommit(async () => {
    console.log("All requests in this atomic request were successful");
});
```

## `useRollback`

Defines an async function that will be called after all the calls in the request have been made if any of them were not successful:

```ts
// In your RPC function:

useRollback(async () => {
    console.log("Some or all of the requests in this atomic request were not successful");
});
```

## `useDatabaseTransaction`

> **NOTE:** For this to have expected behaviour, the `transaction` function must be split out from your RPC function. Additionally, your transaction object must have a `commit` and `rollback` method (these can return a `Promise` or be sync, that doesn't matter, promises will be awaited).

This hook is used to share a database transaction between multiple calls in your atomic request. This is useful for maintaining atomicity of database operations since any failures will cause all operations to be rolled back. To use this, you should pass in either a async or sync function that returns a `Promise<YourTransactionType>` or `YourTransactionType` respectively. **You do NOT need to (and probably shouldn't) actually commit or rollback the transaction yourself. This hook does all of that for you. It doesn't, however, change the type, and if you do that, it will perform that act on the held transaction and then drop it from the internal state.**

```ts
// In your RPC function:

const tx = await useDatabaseTransaction(db.transaction);
// ^ YourTransactionType

// In another call in the same atomic request:

const tx = await useDatabaseTransaction(db.transaction);
// ^ Same transaction as before
```

## Deduping

> **NOTE:** For this to have expected behaviour, the deduped function must be split out from your RPC function.

Sometimes in an atomic workflow, you will have a request you want to do once for all the requests batched together, but you don't want to cache for future users. Think of this as a similar use case to `cache` in React. Note this intentionally does NOT change the signature and should not feel different to use than before:

```ts
// OUTSIDE of your RPC function, have a helper function like this:

const getWeather = dedupe(async (location: string) => {
    const weather = await fetch(`https://weather.io/?location=${encodeURIComponent(location)}`);
    if (!weather.ok) {
        throw new Error("Failed to fetch weather");
    }
    return await weather.json();
});

// If for whatever reason you need the function under the dedupe proxy:

const underlyingDedupeFunction = getUnderlyingDedupeFunction(getWeather);

// Inside of your RPC function:

let isDeduped = alreadyDeduped(getWeather, "Stockholm");
// ^ false (we haven't called it yet)

const weather = await getWeather("Stockholm");
// ^ { temperature: -1, weather: "snow" }

isDeduped = alreadyDeduped(getWeather, "Stockholm");
// ^ true (we just called it)

console.log(weather === (await getWeather("Stockholm")));
// ^ true (the dedupe function is calling the same function with the same arguments)
```
