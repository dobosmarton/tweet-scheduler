import { z } from "zod";

// Key: "tweet:{userId}"
export const tweetSchema = z.object({
  keywords: z.array(z.string()),
});

// Key: "tweet-history:{userId}"
export const tweetHistorySchema = z
  .array(
    z.object({
      userId: z.string(),
      text: z.string(),
      createdAt: z.string(),
    })
  )
  .nullable()
  .optional();

export const tokenSchema = z.object({
  token_type: z.string(),
  access_token: z.string(),
  refresh_token: z.string(),
  scope: z.string(),
  expires_at: z.number(),
});

export type Tweet = z.infer<typeof tweetSchema>;
export type TweetHistory = z.infer<typeof tweetHistorySchema>;
export type Token = z.infer<typeof tokenSchema>;
