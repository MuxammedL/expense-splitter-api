export interface MemberBalance {
  memberId: string;
  memberName: string;
  balance: number;
}

export interface Settlement {
  fromMemberId: string;
  fromMemberName: string;
  toMemberId: string;
  toMemberName: string;
  amount: number;
}
