import request from "supertest";
import { beforeEach, describe, expect, it } from "@jest/globals";
import app from "../src/app";
import { groups } from "../src/data/store";

describe("Group API validation integration", () => {
  beforeEach(() => {
    groups.length = 0;
  });

  it("should return 400 when participantIds is empty", async () => {
    const groupResponse = await request(app)
      .post("/groups")
      .send({ name: "Weekend Trip" });

    const groupId = groupResponse.body.id;

    const memberResponse = await request(app)
      .post(`/groups/${groupId}/members`)
      .send({ name: "Ali" });

    const aliId = memberResponse.body.id;

    const expenseResponse = await request(app)
      .post(`/groups/${groupId}/expenses`)
      .send({
        title: "Dinner",
        amount: 90,
        paidByMemberId: aliId,
        participantIds: [],
      });

    expect(expenseResponse.status).toBe(400);
    expect(expenseResponse.body).toEqual({
      message: "participantIds must be a non-empty array",
    });
  });
});
