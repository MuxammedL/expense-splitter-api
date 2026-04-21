export interface Expense {
  id: string;
  title: string;
  amount: number;
  paidByMemberId: string;
  participantIds: string[];
  createdAt: string;
}
