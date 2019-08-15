import { HttpModule, HttpService } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { Observable, of } from "rxjs";
import { COMPONENT_NAME } from "./constants";
import { SendGridHealthIndicator } from "./sendgrid.health";
describe("SendGridHealthIndicator", () => {
  it("should need HttpModule", async () => {
    await expect(
      Test.createTestingModule({
        providers: [SendGridHealthIndicator],
      }).compile(),
    ).rejects.toThrowError(
      `Nest can't resolve dependencies of the SendGridHealthIndicator (?). Please make sure that the argument at index [0] is available in the _RootTestModule context.`,
    );
  });

  it("should compile SendGridHealthIndicator", async () => {
    await expect(
      Test.createTestingModule({
        imports: [HttpModule],
        providers: [SendGridHealthIndicator],
      }).compile(),
    ).resolves.toBeDefined();
  });

  describe("is", () => {
    let service: SendGridHealthIndicator;
    beforeEach(async () => {
      const app = await Test.createTestingModule({
        imports: [HttpModule],
        providers: [SendGridHealthIndicator],
      }).compile();
      service = app.get<SendGridHealthIndicator>(SendGridHealthIndicator);
    });
    it("should return status up", async () => {
      await expect(service.isHealthy()).resolves.toEqual({
        sendgrid: {
          apiStatus: "operational",
          status: "up",
        },
      });
    });

    it("should throw error when component is not found", async () => {
      const httpMock = {
        get: (): Observable<any> =>
          of({
            data: {
              components: [],
            },
          }),
      };
      const app = await Test.createTestingModule({
        imports: [HttpModule],
        providers: [SendGridHealthIndicator],
      })
        .overrideProvider(HttpService)
        .useValue(httpMock)
        .compile();
      service = app.get<SendGridHealthIndicator>(SendGridHealthIndicator);
      await expect(service.isHealthy()).rejects.toThrowError("SendGridHealthCheck failed");
    });

    it("should return status down when status is outage", async () => {
      const httpMock = {
        get: (): Observable<any> =>
          of({
            data: {
              components: [
                {
                  name: COMPONENT_NAME,
                  status: "Major outage",
                },
              ],
            },
          }),
      };
      const app = await Test.createTestingModule({
        imports: [HttpModule],
        providers: [SendGridHealthIndicator],
      })
        .overrideProvider(HttpService)
        .useValue(httpMock)
        .compile();
      service = app.get<SendGridHealthIndicator>(SendGridHealthIndicator);
      await expect(service.isHealthy()).resolves.toEqual({
        sendgrid: { apiStatus: "Major outage", status: "down" },
      });
    });
  });
});
