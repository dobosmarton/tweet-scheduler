import { siX } from "simple-icons";
import { Button } from "@/components/ui/button";
import * as twitter from "@/lib/twitter";

export const TwitterLogin = () => {
  return (
    <form action={twitter.login}>
      <Button variant="default" type="submit" className="w-full">
        Login with
        <svg
          role="img"
          viewBox="0 0 24 24"
          className="ml-2 h-4 w-4"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg">
          <path d={siX.path}></path>
        </svg>
      </Button>
    </form>
  );
};
