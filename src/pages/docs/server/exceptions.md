---
layout: "@/layouts/DocsLayout.astro"
title: Exceptions
description: Learn how to handle exceptions in your RPC server.
back: "/docs/server/hooks"
next: "/docs/client/support"
---

arpc supports custom exceptions. This allows for you to create exceptions that will be exposed to both the client and the server, and you can simply just throw them from the server and they will be catchable from the client. To do this, we can simply scaffold an exception with the following command:

```plaintext
$ arpc scaffold exception MyBadThing
✔  Exception MyBadThing set up.
```

From here, a file at `rpc/exceptions/MyBadThing.ts` will be created. This file will contain the exception class and you can extend the body/constructor as you see fit. The JSDoc for the exception will be added to the documentation:

```ts
export class MyBadThing extends Error {
    get body() {
        // TODO: Return a body that is useful to the user.
        return null;
    }
}
```

From here, now this is registered, you can simply import and throw the exception from your RPC methods:

```ts
import { MyBadThing } from "@/rpc/exceptions/MyBadThing";

throw new MyBadThing("data for my constructor");
```

The router will automatically handle it in all types of calls and the exception will be exposed to the client and added to the documentation.
