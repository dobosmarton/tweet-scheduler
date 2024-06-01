import { siX } from "simple-icons";
import { cn } from "@/lib/utils";
import { TwitterLogin } from "@/components/twitter";

export default function Home() {
  return (
    <main className="container relative hidden h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            role="img"
            viewBox="0 0 24 24"
            className="mr-2 h-4 w-4"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg">
            <path d={siX.path}></path>
          </svg>
          Awesome Tweet Scheduler
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This is an awesome, easy to use tool to schedule tweets regularly, simply love it!&rdquo;
            </p>
            <footer className="text-sm">John Doe</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Login with your account</h1>
            <p className="text-sm text-muted-foreground">Connect you X profile and start scheduling</p>
          </div>
          <div className={cn("grid gap-6")}>
            <TwitterLogin />
          </div>
        </div>
      </div>
    </main>
  );
}
