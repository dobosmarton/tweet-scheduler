import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const MinutesSelect = () => {
  return (
    <Select name="minutes">
      <SelectTrigger className="w-[100px]">
        <SelectValue placeholder="Minutes" />
      </SelectTrigger>
      <SelectContent>
        {[...Array(12)].map((_, index) => {
          const min = (index * 5).toString().padStart(2, "0");
          return (
            <SelectItem key={index} value={min}>
              {min}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
