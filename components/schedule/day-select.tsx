import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const DaySelect = () => {
  return (
    <Select name="frequency" defaultValue="daily">
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Frequency" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={"daily"}>Every day</SelectItem>
        <SelectItem value={"monday"}>Monday</SelectItem>
        <SelectItem value={"tuesday"}>Tuesday</SelectItem>
        <SelectItem value={"wednesday"}>Wednesday</SelectItem>
        <SelectItem value={"thursday"}>Thursday</SelectItem>
        <SelectItem value={"friday"}>Friday</SelectItem>
        <SelectItem value={"saturday"}>Saturday</SelectItem>
        <SelectItem value={"sunday"}>Sunday</SelectItem>
      </SelectContent>
    </Select>
  );
};
