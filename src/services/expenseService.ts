import { Group } from "../models/Group";
import { MemberBalance, Settlement } from "../types";

export const calculateBalances = (group: Group): MemberBalance[] => {
  const balances: Record<string, number> = {};

  group.members.forEach((member) => {
    balances[member.id] = 0;
  });

  group.expenses.forEach((expense) => {
    const splitAmount = expense.amount / expense.participantIds.length;

    balances[expense.paidByMemberId] += expense.amount;

    expense.participantIds.forEach((participantId) => {
      balances[participantId] -= splitAmount;
    });
  });

  return group.members.map((member) => ({
    memberId: member.id,
    memberName: member.name,
    balance: Number(balances[member.id].toFixed(2)),
  }));
};

export const calculateSettlements = (group: Group): Settlement[] => {
  const balances = calculateBalances(group);

  const creditors = balances
    .filter((member) => member.balance > 0)
    .map((member) => ({
      memberId: member.memberId,
      memberName: member.memberName,
      amount: member.balance,
    }))
    .sort((a, b) => b.amount - a.amount);

  const debtors = balances
    .filter((member) => member.balance < 0)
    .map((member) => ({
      memberId: member.memberId,
      memberName: member.memberName,
      amount: Math.abs(member.balance),
    }))
    .sort((a, b) => b.amount - a.amount);

  const settlements: Settlement[] = [];

  let creditorIndex = 0;
  let debtorIndex = 0;

  while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
    const creditor = creditors[creditorIndex];
    const debtor = debtors[debtorIndex];

    const paymentAmount = Number(
      Math.min(creditor.amount, debtor.amount).toFixed(2),
    );

    settlements.push({
      fromMemberId: debtor.memberId,
      fromMemberName: debtor.memberName,
      toMemberId: creditor.memberId,
      toMemberName: creditor.memberName,
      amount: paymentAmount,
    });

    creditor.amount = Number((creditor.amount - paymentAmount).toFixed(2));
    debtor.amount = Number((debtor.amount - paymentAmount).toFixed(2));

    if (creditor.amount === 0) {
      creditorIndex++;
    }

    if (debtor.amount === 0) {
      debtorIndex++;
    }
  }

  return settlements;
};
