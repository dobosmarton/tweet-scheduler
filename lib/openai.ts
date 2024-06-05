import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

/**
 * Generates a new tweet based on the given keywords and previous tweets.
 * Adds the hashtag #WrittenbyAI at the end of the generated tweet.
 * Generates the text without double quotes ("") in it.
 *
 * @param keywords - An array of keywords to base the tweet on.
 * @param previousTweets - An array of previous tweets in the topic.
 * @returns A promise that resolves to a ChatCompletion object representing the generated tweet.
 */
export const generateTweet = async (
  keywords: string[],
  previousTweets: string[]
): Promise<OpenAI.Chat.Completions.ChatCompletion> => {
  const previousTweetMessages = previousTweets.map((tweet, index) => ({
    role: "user" as const,
    content: `Previous tweet in the topic: ${tweet}`,
    name: `previous-tweet-${index}`,
  }));

  return openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a helpful and creative social media assistant.",
      },
      ...previousTweetMessages,
      {
        role: "user",
        content: `Based on the keywords: ${keywords.join(",")}${
          previousTweetMessages.length > 0 ? " and the previous tweets above in this topic" : ""
        }, generate a new tweet. Add the hashtag #WrittenbyAI at the end. Generate the text wihtout " in it.`,
      },
    ],
  });
};
