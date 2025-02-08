---
layout: "@/layouts/DocsLayout.astro"
title: Versioning
description: How to version your API the arpc way using stacked APIs and GitHub linting.
back: /docs
next: /docs/server/atomics
---

arpc methods follow stacked versioning. This means the following:

- When you create a new version, the methods from the previous version are not copied initially. This is intentional behaviour since functions are not by default broke between API revisions. If you wish to break a method in a new version, you must run `arpc methods break my.method`. This will create a new copied method file with the same name as the original method but in the new API version folder. Until it is pushed to `main`, you can go ahead and break this method in any way you need.
- After you publish an API into your main branch, any future attempts to break methods on it will result in a GitHub Action failure. It is suggested in this event you create a new API version since this is a breaking change and users may be relying on the old behaviour. It is worth noting that adding fields to a methods output or optional inputs is not a breaking change since they do not change the method signature.
- To drop an API version, it is suggested that you create a new API version and then deprecate the old one first. This will give your users time to migrate to the new version.

When users (or yourselves) generate a new client with the CLI, the new versions will automatically be included in the SDK that is generated. This means that you do not need to worry about updating what will be returned to the client, but does mean you may want some procedure to automatically generate new SDKs when you have a new version if this is a service that you are providing to your users.

## Generating Clients based on your API versions

To generate the new clients, you have 2 options (in this example, we are using the `typescript` client generator, but there are many more - see [Client Support](/docs/client/support) for more information):

1. **Generate the user clients based off production:** If you wish to have a flow that runs after it is deployed to your production, this might be the best option. Simply run the generator on your API after it is deployed:
    ```plaintext
    $ npx arpc generate typescript https://your-service.io
    ✔  Client generated.
    ```
2. **Generate the user clients based off a local server remapped to your production API:** If you want to generate from a local server (say in development or during your CI/CD pipeline) but you know the production API URL, you can remap the local server to the production API URL. This will generate the client based off the remapped server:
    ```plaintext
    $ npx arpc generate typescript http://localhost:3000 https://your-service.io
    ✔  Client generated.
    ```

## Bumping API versions

arpc supports stable, beta, and alpha API versions. This means that you can create API versions that you want to deprecate faster without needing to suggest them to your users. When a user goes to your documentation and you have said versions, they will have a toggle to select the type of versions they want to see.

To bump to a stable version, we simply run the `bump` sub-command:

```plaintext
$ npx arpc versions bump
✔  API bumped to v2.
```

Bumping to a alpha or beta version simply involves using the `alpha` or `beta` sub-command:

```plaintext
$ npx arpc versions alpha
✔  API bumped to v2a1.
```

If we want to drop a method from an API version rather than break it, we can do so by running the `drop` sub-command:

```plaintext
$ npx arpc methods drop my.method
✔  Method dropped.
```

These versions can easily be rolled up to the stable API since when you run to bump a stable release, it will inherit the latest release. But in the future, we might want to drop an API version.

## Dropping an API version

As mentioned above, before you drop an API version, you should deprecate it first. This will give your users time to migrate to the new version.

```plaintext
$ npx arpc versions deprecate v2a1 "I don't think this version is good"
✔  API version v2a1 deprecated.
```

Once you have deprecated an API version, you can drop it after the amount of time you wish to give your users to migrate to the new version:

```plaintext
$ npx arpc versions drop v2a1
✔  API version v2a1 dropped.
```
