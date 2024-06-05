import { z } from "zod";
import { logger, schedules } from "@trigger.dev/sdk/v3";
import * as twitterLib from "@/lib/twitter";
import * as redisClient from "@/lib/redis/client";
import * as openAI from "@/lib/openai";

//this task will run when any of the attached schedules trigger
export const scheduledTweetTask = schedules.task({
  id: "scheduled-tweet-task",
  run: async (payload) => {
    try {
      if (!payload.externalId) {
        throw new Error("External ID is required!");
      }

      const token = await redisClient.getUserToken(payload.externalId);

      if (!token) {
        throw new Error("No token found for the user");
      }

      let latestToken = token;
      if (token.expires_at && new Date(token.expires_at) < new Date()) {
        const { token: refreshedToken } = await twitterLib.refreshToken(token);
        latestToken = refreshedToken;
      }

      const { keywords } = await redisClient.getTweet(payload.externalId);

      logger.info(`Keywords, ${keywords}`);

      const tweetHistoryList = await redisClient.getTweetHistory(payload.externalId);

      logger.info(`Tweet history, ${tweetHistoryList}`);

      // Generate a tweet based on the keywords
      const openAIResponse = await openAI.generateTweet(
        keywords,
        (tweetHistoryList ?? []).map((tweet) => tweet.text)
      );

      logger.info(`OpenAI response: ${JSON.stringify(openAIResponse)}`);

      const tweetText = openAIResponse.choices[0].message.content;

      if (!tweetText) {
        throw new Error("Failed to generate tweet text");
      }

      const response = await twitterLib.createTweet(latestToken, tweetText);

      if (response.errors) {
        throw new Error(response.errors.map((error) => error.detail).join(", "));
      }

      await redisClient.addTweetHistory(payload.externalId, tweetText);

      logger.info(`Tweet history added for tweet ID: ${payload.externalId}`);

      return response.data;
    } catch (error) {
      if (error instanceof z.ZodError) {
        logger.error(`Error in scheduledTweetTask: ${error.flatten()}`);
        throw error;
      }

      logger.error("Error in scheduledTweetTask", { error });
      throw error;
    }
  },
});
