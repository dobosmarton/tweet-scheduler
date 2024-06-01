"use server";

import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { OAuth2UserOptions } from "twitter-api-sdk/dist/OAuth2User";

import { scheduledTweetTask } from "@/trigger/scheduled-tweet";
import { schedules } from "@trigger.dev/sdk/v3";
import * as redisClient from "./redis/client";
import * as cron from "./cron";

export const scheduleTweet = async (props: cron.ScheduleInput) => {
  const tweetId = randomUUID();

  const transformedCron = cron.scheduleSchema.parse(props);

  const savedToken = cookies().get("token");
  const token: OAuth2UserOptions["token"] | undefined = savedToken ? JSON.parse(savedToken.value) : undefined;

  if (!token) {
    throw new Error("No token found in cookies");
  }

  await redisClient.addUserToken(tweetId, JSON.stringify(token));

  await redisClient.addTweet(tweetId, props.keywords);

  const createdSchedule = await schedules.create({
    task: scheduledTweetTask.id,
    cron: transformedCron,
    externalId: tweetId,
    //this makes it impossible to have two schedules for the same tweet
    deduplicationKey: `${tweetId}-tweet-schedule`,
  });

  return { id: createdSchedule.id, nextRun: createdSchedule.nextRun ?? null };
};
