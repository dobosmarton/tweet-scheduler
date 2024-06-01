import { Button } from "@/components/ui/button";
import * as twitter from "@/lib/twitter";

export const TwitterLogout = () => {
  return (
    <form action={twitter.logout}>
      <Button variant="outline" type="submit">
        Logout
      </Button>
    </form>
  );
};
