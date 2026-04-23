import request from "supertest";
import { beforeEach, describe, expect, it } from "@jest/globals";
import app from "../src/app";
import { groups } from "../src/data/store";

describe("Group API negative integration tests", () => {
  beforeEach(() => {
    groups.length = 0;
  });

  it("should return 400 when group name is missing", async () => {
    const response = await request(app).post("/groups").send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Group name is required",
    });
  });

  it("should return 404 when adding member to non-existing group", async () => {
    const response = await request(app)
      .post("/groups/unknown-group-id/members")
      .send({ name: "Ali" });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "Group not found",
    });
  });

  it("should return 400 when adding duplicate member to the same group", async () => {
    const groupResponse = await request(app)
      .post("/groups")
      .send({ name: "Weekend Trip" });

    const groupId = groupResponse.body.id;

    const firstMemberResponse = await request(app)
      .post(`/groups/${groupId}/members`)
      .send({ name: "Ali" });

    expect(firstMemberResponse.status).toBe(201);

    const duplicateMemberResponse = await request(app)
      .post(`/groups/${groupId}/members`)
      .send({ name: "Ali" });

    expect(duplicateMemberResponse.status).toBe(400);
    expect(duplicateMemberResponse.body).toEqual({
      message: "Member already exists in this group",
    });
  });

  it("should return 400 when expense amount is invalid", async () => {
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
        amount: 0,
        paidByMemberId: aliId,
        participantIds: [aliId],
      });

    expect(expenseResponse.status).toBe(400);
    expect(expenseResponse.body).toEqual({
      message: "Amount must be a number greater than 0",
    });
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

  it("should return 400 when paidByMemberId does not belong to the group", async () => {
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
        paidByMemberId: "unknown-member",
        participantIds: [aliId],
      });

    expect(expenseResponse.status).toBe(400);
    expect(expenseResponse.body).toEqual({
      message: "Paid by member does not exist in this group",
    });
  });

  it("should return 400 when one of participantIds does not belong to the group", async () => {
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
        participantIds: [aliId, "unknown-member"],
      });

    expect(expenseResponse.status).toBe(400);
    expect(expenseResponse.body).toEqual({
      message: "One or more participantIds do not exist in this group",
    });
  });

  it("should return 404 when requesting balances for non-existing group", async () => {
    const response = await request(app).get(
      "/groups/unknown-group-id/balances",
    );

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "Group not found",
    });
  });

  it("should return 404 when requesting settlements for non-existing group", async () => {
    const response = await request(app).get(
      "/groups/unknown-group-id/settlements",
    );

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "Group not found",
    });
  });
});
