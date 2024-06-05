"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Client, auth } from "twitter-api-sdk";
import { OAuth2UserOptions } from "twitter-api-sdk/dist/OAuth2User";

const getTwitterClients = (token?: OAuth2UserOptions["token"]) => {
  const authClient = new auth.OAuth2User({
    client_id: process.env.TWITTER_CLIENT_ID ?? "",
    client_secret: process.env.TWITTER_CLIENT_SECRET ?? "",
    callback: "http://127.0.0.1:3000/callback",
    scopes: ["tweet.write", "users.read", "tweet.read", "offline.access"],
    token,
  });

  const client = new Client(authClient);

  return { authClient, client };
};

/**
 * Retrieves the Twitter token from the cookies.
 * @returns The Twitter token if it exists, otherwise undefined.
 */
const getTwitterTokenFromCookies = (): OAuth2UserOptions["token"] | undefined => {
  const savedToken = cookies().get("token");
  return savedToken ? JSON.parse(savedToken.value) : undefined;
};

/**
 * Generates the authentication URL for Twitter.
 * @param authClient - The OAuth2User object used for authentication.
 * @returns The authentication URL.
 */
const generateAuthURL = (authClient: auth.OAuth2User) => {
  return authClient.generateAuthURL({
    state: process.env.TWITTER_STATE_STRING ?? "",
    code_challenge_method: "plain",
    code_challenge: process.env.TWITTER_CODE_CHALLENGE ?? "",
  });
};

/**
 * Logs in the user by generating an authentication URL and redirecting to it.
 * @returns {Promise<void>} A promise that resolves once the user is redirected.
 * @throws {Error} An error is thrown if the authentication URL cannot be generated.
 */
export const login = async (): Promise<void> => {
  const token = getTwitterTokenFromCookies();
  const { authClient } = getTwitterClients(token);
  const url = generateAuthURL(authClient);

  if (url) {
    redirect(url);
  }
};

/**
 * Requests an access token from Twitter API.
 * @param code - The authorization code received from Twitter.
 * @param state - The state parameter received from Twitter.
 * @returns A Promise that resolves to the access token.
 * @throws An error if the state parameter doesn't match the expected value.
 */
export const requestAccessToken = async (code: string, state: string) => {
  if (state !== process.env.TWITTER_STATE_STRING) {
    throw new Error("State isn't matching!");
  }

  const token = getTwitterTokenFromCookies();
  const { authClient } = getTwitterClients(token);

  generateAuthURL(authClient);

  return authClient.requestAccessToken(code);
};

/**
 * Refreshes the access token for Twitter authentication.
 *
 * @param token - The OAuth2 user token.
 * @returns A promise that resolves to the refreshed access token.
 */
export const refreshToken = async (token?: OAuth2UserOptions["token"]) => {
  const { authClient } = getTwitterClients(token);
  return authClient.refreshAccessToken();
};

/**
 * Logs out the user from Twitter by revoking the access token and deleting the token from cookies.
 */
export const logout = async () => {
  const token = getTwitterTokenFromCookies();
  const { authClient } = getTwitterClients(token);
  await authClient.revokeAccessToken();
  cookies().delete("token");
  redirect("/");
};

/**
 * Retrieves the current user's ID from Twitter API using the provided token.
 * @param token - The OAuth2 token for authentication.
 * @returns The current user's ID.
 * @throws If there are errors returned from the API or if the user ID is not found.
 */
export const getCurrentUserId = async (token: OAuth2UserOptions["token"]) => {
  const { client } = getTwitterClients(token);

  const res = await client.users.findMyUser();

  if (res.errors) {
    throw new Error(res.errors.map((error) => error.detail).join(", "));
  }

  if (!res.data?.id) {
    throw new Error("User ID not found");
  }

  return res.data.id;
};

/**
 * Creates a new tweet using the provided token and text.
 * @param token - The OAuth2 user token.
 * @param text - The content of the tweet.
 * @returns A Promise that resolves to the created tweet.
 */
export const createTweet = async (token: OAuth2UserOptions["token"], text: string) => {
  const { client } = getTwitterClients(token);
  return client.tweets.createTweet({ text });
};
