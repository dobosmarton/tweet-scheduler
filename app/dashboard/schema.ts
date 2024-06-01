import { z } from "zod";
import { zfd } from "zod-form-data";

export type State =
  | {
      id: string;
      nextRun: Date | null;
    }
  | {
      message: string;
      errors?: Array<{
        path: string;
        message: string;
      }>;
    }
  | null;

export const formSchema = zfd
  .formData({
    hour: zfd.text(z.string({ message: "Please select an hour value for the schedule!" }).min(2).max(2)),
    minutes: zfd.text(z.string({ message: "Please select a minutes value for the schedule!" }).min(2).max(2)),
    frequency: zfd.text(
      z.enum(["daily", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"], {
        message: "Please select a frequency for the schedule!",
      })
    ),
    keywords: zfd.text(z.string({ message: "Please add keywords!" }).regex(/^[a-zA-Z0-9, ]+$/)),
  })
  .transform((data) => ({
    time: `${data.hour}:${data.minutes}`,
    frequency: data.frequency,
    keywords: data.keywords.split(","),
  }));
