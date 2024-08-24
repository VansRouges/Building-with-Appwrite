import { Client, Account, ID } from 'appwrite';

const id: string | undefined = process.env.NEXT_PUBLIC_APPWRITE_ID;

if (!id) {
    throw new Error('NEXT_PUBLIC_APPWRITE_PROJECT is not defined.');
}

export const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(id); // Replace with your project ID

export const account = new Account(client);
export { ID };
