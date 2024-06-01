"use client";

import { useFormState } from "react-dom";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TwitterLogout } from "@/components/twitter";
import { DaySelect, HourSelect, MinutesSelect } from "@/components/schedule";

import { handleScheduleForm } from "./actions";
import { State } from "./schema";

export default function Dashboard() {
  const [state, formAction] = useFormState<State, FormData>(handleScheduleForm, null);

  return (
    <main className="flex min-h-screen items-start flex-col p-24 gap-6">
      <TwitterLogout />
      <form action={formAction} className="flex w-full max-w-5xl flex-col items-start font-mono text-sm gap-6">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Schedule new tweets to be posted on Twitter at specific times and days.
        </p>

        <div className="flex gap-4">
          <DaySelect />
          <HourSelect />
          <MinutesSelect />
        </div>
        <Textarea
          name="keywords"
          placeholder="Type the keywords here (use , as the seperator, e.g AI, tech, workflow)."
        />
        <Button type="submit" variant="outline">
          Schedule
        </Button>

        {state && "id" in state && (
          <p>
            Your tweet has been scheduled with ID: <code>{state.id}</code>, (next run: {state.nextRun?.toLocaleString()}
            ).
          </p>
        )}

        {state && "errors" in state && (
          <ul>
            {(state.errors ?? []).map((error) => (
              <li className="text-red-700" key={error.path}>
                {error.message}
              </li>
            ))}
          </ul>
        )}
      </form>
    </main>
  );
}
