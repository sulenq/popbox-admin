import { Type__DateRange } from "@/constants/types";

const getThisMonthDateRange = (): Type__DateRange => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    from: start.toISOString().split("T")[0],
    to: end.toISOString().split("T")[0],
  };
};
export default getThisMonthDateRange;
