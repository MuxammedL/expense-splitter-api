import request from "supertest";
import { beforeEach, describe, expect, it } from "@jest/globals";
import app from "../src/app";
import { groups } from "../src/data/store";

describe("Group API integration", () => {
  beforeEach(() => {
    groups.length = 0;
  });

  it("should create group, add members, add expense, and return balances and settlements", async () => {
    const createGroupResponse = await request(app)
      .post("/groups")
      .send({ name: "Weekend Trip" });

    expect(createGroupResponse.status).toBe(201);
    expect(createGroupResponse.body.name).toBe("Weekend Trip");
    expect(createGroupResponse.body.members).toEqual([]);
    expect(createGroupResponse.body.expenses).toEqual([]);

    const groupId = createGroupResponse.body.id;

    const aliResponse = await request(app)
      .post(`/groups/${groupId}/members`)
      .send({ name: "Ali" });

    const veliResponse = await request(app)
      .post(`/groups/${groupId}/members`)
      .send({ name: "Veli" });

    const ayseResponse = await request(app)
      .post(`/groups/${groupId}/members`)
      .send({ name: "Ayse" });

    expect(aliResponse.status).toBe(201);
    expect(veliResponse.status).toBe(201);
    expect(ayseResponse.status).toBe(201);

    const aliId = aliResponse.body.id;
    const veliId = veliResponse.body.id;
    const ayseId = ayseResponse.body.id;

    const expenseResponse = await request(app)
      .post(`/groups/${groupId}/expenses`)
      .send({
        title: "Dinner",
        amount: 90,
        paidByMemberId: aliId,
        participantIds: [aliId, veliId, ayseId],
      });

    expect(expenseResponse.status).toBe(201);
    expect(expenseResponse.body.title).toBe("Dinner");
    expect(expenseResponse.body.amount).toBe(90);

    const balancesResponse = await request(app).get(
      `/groups/${groupId}/balances`
    );

    expect(balancesResponse.status).toBe(200);
    expect(balancesResponse.body).toEqual([
      {
        memberId: aliId,
        memberName: "Ali",
        balance: 60,
      },
      {
        memberId: veliId,
        memberName: "Veli",
        balance: -30,
      },
      {
        memberId: ayseId,
        memberName: "Ayse",
        balance: -30,
      },
    ]);

    const settlementsResponse = await request(app).get(
      `/groups/${groupId}/settlements`
    );

    expect(settlementsResponse.status).toBe(200);
    expect(settlementsResponse.body).toEqual([
      {
        fromMemberId: veliId,
        fromMemberName: "Veli",
        toMemberId: aliId,
        toMemberName: "Ali",
        amount: 30,
      },
      {
        fromMemberId: ayseId,
        fromMemberName: "Ayse",
        toMemberId: aliId,
        toMemberName: "Ali",
        amount: 30,
      },
    ]);
  });
});