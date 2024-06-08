import { z } from "zod";

export const scheduleSchema = z
  .object({
    time: z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format, expected HH:MM")
      .transform((value) => {
        const [hour, minute] = value.split(":");
        return { hour, minute };
      }),

    frequency: z.enum(["daily", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]),
    keywords: z.array(z.string({ message: "Please add keywords!" })),
  })
  .transform((value) => {
    if (value.frequency === "daily") {
      return { time: value.time, frequency: value.frequency, weekday: undefined };
    }
    return {
      time: value.time,
      frequency: value.frequency,
      weekday: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].indexOf(value.frequency),
    };
  })
  .transform((value) => {
    if (value.frequency === "daily") {
      return `${value.time.minute} ${value.time.hour} * * *`;
    }
    return `${value.time.minute} ${value.time.hour} * * ${value.weekday + 1}`;
  });

export type ScheduleInput = z.input<typeof scheduleSchema>;
