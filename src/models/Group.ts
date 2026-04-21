import { Member } from "./Member";
import { Expense } from "./Expense";

export interface Group {
  id: string;
  name: string;
  members: Member[];
  expenses: Expense[];
}
