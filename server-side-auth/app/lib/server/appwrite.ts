// lib/server/appwrite.ts
"use server";
import { Client, Account } from "node-appwrite";
import { cookies } from "next/headers";

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string;
const projectID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT as string;
const apiKey = process.env.NEXT_APPWRITE_KEY as string;

// Define the types for the session client and admin client return objects
interface SessionClient {
  readonly account: Account;
}

interface AdminClient {
  readonly account: Account;
}

// Function to create a session client
export async function createSessionClient(): Promise<SessionClient> {
  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectID);

  const session = cookies().get("my-custom-session");
  if (!session || !session.value) {
    throw new Error("No session");
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
  };
}

// Function to create an admin client
export async function createAdminClient(): Promise<AdminClient> {
  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectID)
    .setKey(apiKey);

  return {
    get account() {
      return new Account(client);
    },
  };
}

export async function getLoggedInUser() {
    try {
      const { account } = await createSessionClient();
      return await account.get();
    } catch (error) {
      return null;
    }
  }