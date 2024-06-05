"use server";

import { Redis } from "@upstash/redis";
import { tokenSchema, Tweet, TweetHistory, tweetHistorySchema, tweetSchema } from "./schema";
import { OAuth2UserOptions } from "twitter-api-sdk/dist/OAuth2User";

const client = new Redis({
  url: process.env.REDIS_REST_URL ?? "",
  token: process.env.REDIS_REST_TOKEN ?? "",
});

/**
 * Adds a user token to Redis.
 * @param userId - The ID of the twitter user.
 * @param token - The user token to be added.
 * @returns A Promise that resolves when the token is successfully added.
 */
export const addUserToken = async (userId: string, token: string) => client.set(`token:${userId}`, token);

/**
 * Retrieves the user token associated with a tweet ID from Redis.
 * @param userId The ID of the twitter user.
 * @returns A Promise that resolves to the user token or null if not found.
 */
export const getUserToken = async (userId: string): Promise<OAuth2UserOptions["token"] | null> => {
  const token = await client.get<OAuth2UserOptions["token"]>(`token:${userId}`);
  return tokenSchema.parse(token);
};

/**
 * Deletes a token associated with a tweet ID.
 * @param userId The ID of the twitter user.
 * @returns A Promise that resolves to the number of deleted tokens.
 */
export const deleteToken = async (userId: string) => client.del(`token:${userId}`);

/**
 * Adds a tweet to Redis with the given tweet ID and keywords.
 * @param userId - The ID of the tweet.
 * @param keywords - An array of keywords associated with the tweet.
 * @returns A Promise that resolves when the tweet is successfully added to Redis.
 */
export const addTweet = async (userId: string, keywords: string[]) =>
  client.set(`tweet:${userId}`, JSON.stringify({ keywords }));

/**
 * Retrieves a tweet from Redis based on the provided tweet ID.
 * @param userId - The ID of the twitter user to retrieve.
 * @returns A Promise that resolves to the retrieved tweet.
 */
export const getTweet = async (userId: string): Promise<Tweet> => {
  const tweet = await client.get<string>(`tweet:${userId}`);
  return tweetSchema.parse(tweet);
};

/**
 * Adds a tweet to the tweet history list.
 * If the list already has 5 items, the oldest item is removed.
 * @param userId - The ID of the tweet.
 * @param text - The text content of the tweet.
 * @returns A Promise that resolves to the result of the set operation.
 */
export const addTweetHistory = async (userId: string, text: string) => {
  const historyList = await getTweetHistory(userId);
  let newHistoryList: TweetHistory = [];
  if (historyList && historyList.length === 5) {
    const [, ...rest] = historyList;
    newHistoryList.push(...rest);
  }
  newHistoryList.push({ userId, text, createdAt: new Date().toISOString() });

  return client.set(`tweet-history:${userId}`, JSON.stringify(newHistoryList));
};

/**
 * Retrieves the tweet history for a given user.
 * @param userId - The ID of the user.
 * @returns A Promise that resolves to the tweet history for the user.
 */
export const getTweetHistory = async (userId: string): Promise<TweetHistory> => {
  const tweetHistory = await client.get(`tweet-history:${userId}`);
  const history = tweetHistorySchema.parse(tweetHistory);

  // Sort the history by createdAt date in descending order
  // to get the latest tweet first
  return history?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};
