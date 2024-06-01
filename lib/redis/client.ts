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
 * @param tweetId - The ID of the tweet.
 * @param token - The user token to be added.
 * @returns A Promise that resolves when the token is successfully added.
 */
export const addUserToken = async (tweetId: string, token: string) => client.set(`token:${tweetId}`, token);

/**
 * Retrieves the user token associated with a tweet ID from Redis.
 * @param tweetId The ID of the tweet.
 * @returns A Promise that resolves to the user token or null if not found.
 */
export const getUserToken = async (tweetId: string): Promise<OAuth2UserOptions["token"] | null> => {
  const token = await client.get<OAuth2UserOptions["token"]>(`token:${tweetId}`);
  return tokenSchema.parse(token);
};

/**
 * Deletes a token associated with a tweet ID.
 * @param tweetId The ID of the tweet.
 * @returns A Promise that resolves to the number of deleted tokens.
 */
export const deleteToken = async (tweetId: string) => client.del(`token:${tweetId}`);

/**
 * Adds a tweet to Redis with the given tweet ID and keywords.
 * @param tweetId - The ID of the tweet.
 * @param keywords - An array of keywords associated with the tweet.
 * @returns A Promise that resolves when the tweet is successfully added to Redis.
 */
export const addTweet = async (tweetId: string, keywords: string[]) =>
  client.set(`tweet:${tweetId}`, JSON.stringify({ keywords }));

/**
 * Retrieves a tweet from Redis based on the provided tweet ID.
 * @param tweetId - The ID of the tweet to retrieve.
 * @returns A Promise that resolves to the retrieved tweet.
 */
export const getTweet = async (tweetId: string): Promise<Tweet> => {
  const tweet = await client.get<string>(`tweet:${tweetId}`);
  return tweetSchema.parse(tweet);
};

/**
 * Adds a tweet to the tweet history list.
 * If the list already has 5 items, the oldest item is removed.
 * @param tweetId - The ID of the tweet.
 * @param text - The text content of the tweet.
 * @returns A Promise that resolves to the result of the set operation.
 */
export const addTweetHistory = async (tweetId: string, text: string) => {
  const historyList = await getTweetHistory(tweetId);
  let newHistoryList: TweetHistory = [];
  if (historyList && historyList.length === 5) {
    const [, ...rest] = historyList;
    newHistoryList.push(...rest);
  }
  newHistoryList.push({ tweetId, text, createdAt: new Date().toISOString() });

  return client.set(`tweet-history:${tweetId}`, JSON.stringify(newHistoryList));
};

/**
 * Retrieves the tweet history for a given tweet ID from Redis.
 * @param tweetId - The ID of the tweet.
 * @returns A Promise that resolves to the tweet history.
 */
export const getTweetHistory = async (tweetId: string): Promise<TweetHistory> => {
  const tweetHistory = await client.get(`tweet-history:${tweetId}`);
  return tweetHistorySchema.parse(tweetHistory);
};
