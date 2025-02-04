export const tsCode = `const client = new APIV1Client();

const user = await client.users.get(1);
// ^ a user object is returned

const exists = await client.users.exists(1);
// ^ a boolean is returned`;

export const pythonSyncCode = `client = APIV1Client()

user = client.users.get(1)
# ^ a user object is returned, fully typed

exists = client.users.exists(1)
# ^ a boolean is returned, fully typed`;

export const phpCode = `$client = new APIV1Client();

$user = $client->users->get(1);
// ^ a user object is returned, fully typed

$exists = $client->users->exists(1);
// ^ a boolean is returned, fully typed`;

export const cliExamples = [
    `$ npx arpc versions bump
✔  API bumped to v2.`,
    `$ npx arpc methods create users.get
✔  Method created.`,
    `$ npx arpc methods break users.get
✔  Method prepared for breaking change.`,
    `$ npx arpc generate typescript https://your.api.com
✔  Client generated.`,
];
