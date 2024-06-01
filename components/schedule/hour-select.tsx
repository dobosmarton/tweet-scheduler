import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const HourSelect = () => {
  return (
    <Select name="hour">
      <SelectTrigger className="w-[100px]">
        <SelectValue placeholder="Hour" />
      </SelectTrigger>
      <SelectContent>
        {[...Array(24)].map((_, index) => (
          <SelectItem key={index} value={index.toString().padStart(2, "0")}>
            {index.toString().padStart(2, "0")}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
