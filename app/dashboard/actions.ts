"use server";

import { z, ZodError } from "zod";
import { scheduleTweet } from "@/lib/schedule";
import { formSchema, State } from "./schema";

export const handleScheduleForm = async (_: State | null, formData: z.input<typeof formSchema>): Promise<State> => {
  try {
    const data = formSchema.parse(formData);

    const schedule = await scheduleTweet({
      time: data.time,
      frequency: data.frequency,
      keywords: data.keywords,
    });

    return { id: schedule.id, nextRun: schedule.nextRun };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        message: "Invalid form data",
        errors: error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: `${issue.message}`,
        })),
      };
    }
    return {
      message: "Something went wrong. Please try again.",
      errors: [{ path: "unknown", message: (error as Error).message }],
    };
  }
};
