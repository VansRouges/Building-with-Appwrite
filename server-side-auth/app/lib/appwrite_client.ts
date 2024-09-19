import { Client, Storage, Databases, Account } from "node-appwrite"

const client = new Client()

client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT as string);

const storage = new Storage(client);
const database = new Databases(client);

const account = new Account(client);

export { client, storage, database, account } ;