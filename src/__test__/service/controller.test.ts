import { app } from "../../index";
import supertest from "supertest";

describe("auth", () => {
  const errorObject = {
    type: "Authentication error",
    message: "Vos identifiants sont incorrects",
    errorCode: 500,
    success: false,
  };

  describe("/", () => {
    it("GIVEN nothing, it SHOULD return AuthError", async () => {
      await supertest(app).post(`/auth/`).send().expect(errorObject);
    });
    it("GIVEN name, it SHOULD return SUCCESS", async () => {
      await supertest(app)
        .post(`/auth/`)
        .send({ name: "name" })
        .expect((res) => {
          return res.body.success === true &&
            res.body.hasOwnProperty("id") &&
            res.body.hasOwnProperty("token");
        });
    });
  });
});
describe("room", () => {
  describe("/list", () => {
    it("GIVEN missing values in request values SHOULD return ValidationError", async () => {
      const errorObject = {
        type: "Validation error",
        message:
          "Une erreur inconnue est survenu lors du traitement de la requête",
        errorCode: 400,
        properties: [
          "capacity",
          "scheduledAt",
          "scheduledUntil",
          "id",
          "equipments",
          "hasAll",
        ],
      };

      await supertest(app)
        .get(
          `/rooms/list?equipments=&hasAll=&page&size&capacity=&scheduledAt=&scheduledUntil=&id=`
        )
        .expect(errorObject);
    });
  });
});
describe("booking", () => {
  describe("/list", () => {
    it("GIVEN invalid request values SHOULD return  ValidationError", async () => {
      const errorObject = {
        type: "Validation error",
        message:
          "Une erreur inconnue est survenu lors du traitement de la requête",
        errorCode: 400,
        properties: [
          "id",
          "state",
          "scheduledAt",
          "scheduledUntil",
          "userId",
          "page",
          "size",
        ],
      };

      await supertest(app)
        .get(
          `/booking/list?roomId= &userId=&hasAll=&state=&scheduledAt=&scheduledUntil=&id=&page&size`
        )
        .expect(errorObject);
    });
  });
});
