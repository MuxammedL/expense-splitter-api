import {
  calculateBalances,
  calculateSettlements,
} from "../src/services/expenseService";
import { Group } from "../src/models/Group";
import { describe, it, expect } from "@jest/globals";

describe("expenseService", () => {
  const sampleGroup: Group = {
    id: "group-1",
    name: "Weekend Trip",
    members: [
      { id: "m1", name: "Ali" },
      { id: "m2", name: "Veli" },
      { id: "m3", name: "Ayse" },
    ],
    expenses: [
      {
        id: "e1",
        title: "Dinner",
        amount: 90,
        paidByMemberId: "m1",
        participantIds: ["m1", "m2", "m3"],
        createdAt: "2026-04-21T10:00:00.000Z",
      },
    ],
  };

  it("should calculate balances correctly for one expense", () => {
    const balances = calculateBalances(sampleGroup);

    expect(balances).toEqual([
      {
        memberId: "m1",
        memberName: "Ali",
        balance: 60,
      },
      {
        memberId: "m2",
        memberName: "Veli",
        balance: -30,
      },
      {
        memberId: "m3",
        memberName: "Ayse",
        balance: -30,
      },
    ]);
  });

  it("should calculate settlements correctly for one expense", () => {
    const settlements = calculateSettlements(sampleGroup);

    expect(settlements).toEqual([
      {
        fromMemberId: "m2",
        fromMemberName: "Veli",
        toMemberId: "m1",
        toMemberName: "Ali",
        amount: 30,
      },
      {
        fromMemberId: "m3",
        fromMemberName: "Ayse",
        toMemberId: "m1",
        toMemberName: "Ali",
        amount: 30,
      },
    ]);
  });

  it("should return zero balances when there are no expenses", () => {
    const groupWithoutExpenses: Group = {
      id: "group-2",
      name: "No Expense Group",
      members: [
        { id: "m1", name: "Ali" },
        { id: "m2", name: "Veli" },
      ],
      expenses: [],
    };

    const balances = calculateBalances(groupWithoutExpenses);

    expect(balances).toEqual([
      {
        memberId: "m1",
        memberName: "Ali",
        balance: 0,
      },
      {
        memberId: "m2",
        memberName: "Veli",
        balance: 0,
      },
    ]);
  });

  it("should return empty settlements when balances are already settled", () => {
    const groupWithoutExpenses: Group = {
      id: "group-3",
      name: "Balanced Group",
      members: [
        { id: "m1", name: "Ali" },
        { id: "m2", name: "Veli" },
      ],
      expenses: [],
    };

    const settlements = calculateSettlements(groupWithoutExpenses);

    expect(settlements).toEqual([]);
  });

  it("should calculate balances correctly for multiple expenses", () => {
    const groupWithMultipleExpenses: Group = {
      id: "group-4",
      name: "Trip Group",
      members: [
        { id: "m1", name: "Ali" },
        { id: "m2", name: "Veli" },
        { id: "m3", name: "Ayse" },
      ],
      expenses: [
        {
          id: "e1",
          title: "Dinner",
          amount: 90,
          paidByMemberId: "m1",
          participantIds: ["m1", "m2", "m3"],
          createdAt: "2026-04-21T10:00:00.000Z",
        },
        {
          id: "e2",
          title: "Taxi",
          amount: 60,
          paidByMemberId: "m2",
          participantIds: ["m1", "m2", "m3"],
          createdAt: "2026-04-21T11:00:00.000Z",
        },
      ],
    };

    const balances = calculateBalances(groupWithMultipleExpenses);

    expect(balances).toEqual([
      {
        memberId: "m1",
        memberName: "Ali",
        balance: 40,
      },
      {
        memberId: "m2",
        memberName: "Veli",
        balance: 10,
      },
      {
        memberId: "m3",
        memberName: "Ayse",
        balance: -50,
      },
    ]);
  });

  it("should calculate balances correctly when expense is shared by only some members", () => {
    const group: Group = {
      id: "group-5",
      name: "Partial Participation",
      members: [
        { id: "m1", name: "Ali" },
        { id: "m2", name: "Veli" },
        { id: "m3", name: "Ayse" },
      ],
      expenses: [
        {
          id: "e1",
          title: "Lunch",
          amount: 60,
          paidByMemberId: "m1",
          participantIds: ["m1", "m2"],
          createdAt: "2026-04-21T12:00:00.000Z",
        },
      ],
    };

    expect(calculateBalances(group)).toEqual([
      { memberId: "m1", memberName: "Ali", balance: 30 },
      { memberId: "m2", memberName: "Veli", balance: -30 },
      { memberId: "m3", memberName: "Ayse", balance: 0 },
    ]);
  });

  it("should calculate settlements correctly for multiple creditors", () => {
    const group: Group = {
      id: "group-7",
      name: "Multi Settlement",
      members: [
        { id: "m1", name: "Ali" },
        { id: "m2", name: "Veli" },
        { id: "m3", name: "Ayse" },
      ],
      expenses: [
        {
          id: "e1",
          title: "Dinner",
          amount: 90,
          paidByMemberId: "m1",
          participantIds: ["m1", "m2", "m3"],
          createdAt: "2026-04-21T10:00:00.000Z",
        },
        {
          id: "e2",
          title: "Taxi",
          amount: 60,
          paidByMemberId: "m2",
          participantIds: ["m1", "m2", "m3"],
          createdAt: "2026-04-21T11:00:00.000Z",
        },
      ],
    };

    expect(calculateSettlements(group)).toEqual([
      {
        fromMemberId: "m3",
        fromMemberName: "Ayse",
        toMemberId: "m1",
        toMemberName: "Ali",
        amount: 40,
      },
      {
        fromMemberId: "m3",
        fromMemberName: "Ayse",
        toMemberId: "m2",
        toMemberName: "Veli",
        amount: 10,
      },
    ]);
  });

  it("should handle zero amount expense", () => {
    const group: Group = {
      id: "group-11",
      name: "Zero Expense",
      members: [
        { id: "m1", name: "Ali" },
        { id: "m2", name: "Veli" },
      ],
      expenses: [
        {
          id: "e1",
          title: "Free Item",
          amount: 0,
          paidByMemberId: "m1",
          participantIds: ["m1", "m2"],
          createdAt: "2026-04-21T17:00:00.000Z",
        },
      ],
    };

    expect(calculateBalances(group)).toEqual([
      { memberId: "m1", memberName: "Ali", balance: 0 },
      { memberId: "m2", memberName: "Veli", balance: 0 },
    ]);
  });
});
