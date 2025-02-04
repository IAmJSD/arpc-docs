arpc supports atomic functions and you can use hooks inside the functions to handle them:

```ts
// inside your RPC service...
const tx = useDatabaseTransaction(db.transaction);
// ^ takes a function or Promise that returns a object with a `rollback` and `commit` method.
```

If any of the functions inside the atomic block fail, the transaction will roll back. [There are several other hooks, see the docs for more.](/docs/server/hooks)

Atomics also have a nice to use and clean API on clients. See [atomic clients](/docs/client/atomics):

```ts
const [, posts] = await client.atomic((client, { variable, eq, pluck }) => {
    const resultVar = variable<{ userId: string }>("resultVar");

    return [
        // Call users.changeSignature and put the result into resultVar - if this fails, it will roll back.
        resultVar.set(
            client.users.changeSignature({
                signature: "Hello, world!",
            }),
        ),

        // Call posts.getAll with the userId from resultVar
        client.posts.getAll({
            userId: pluck(resultVar, "userId"),
        }),
    ] as const;
});
```
