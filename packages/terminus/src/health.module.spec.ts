import { Controller, Get, Module } from "@nestjs/common";
import { HealthCheck, HealthCheckService, TerminusModule } from "@nestjs/terminus";
import { Test } from "@nestjs/testing";
import * as request from "supertest";
import { SendGridHealthModule } from "./health.module";
import { SendGridHealthIndicator } from "./sendgrid.health";
describe("SendGridHealthModule", () => {
  it("should compile module", async () => {
    await expect(Test.createTestingModule({ imports: [SendGridHealthModule] }).compile()).resolves.toBeDefined();
  });

  it("should compile health module", async () => {
    @Module({
      imports: [TerminusModule],
    })
    class HealthModule {}

    await expect(Test.createTestingModule({ imports: [HealthModule] }).compile()).resolves.toBeDefined();
  });

  it("should get SendGridHealthIndicator", async () => {
    const app = await Test.createTestingModule({
      imports: [SendGridHealthModule],
    }).compile();

    expect(app.get<SendGridHealthIndicator>(SendGridHealthIndicator)).toBeDefined();
  });

  it("should call /health", async () => {
    @Controller("health")
    class HealthController {
      constructor(private health: HealthCheckService, private sendgrid: SendGridHealthIndicator) {}

      @Get()
      @HealthCheck()
      readiness() {
        return this.health.check([async () => this.sendgrid.isHealthy()]);
      }
    }

    @Module({
      controllers: [HealthController],
      imports: [TerminusModule, SendGridHealthModule],
    })
    class HealthModule {}

    const module = await Test.createTestingModule({ imports: [HealthModule] }).compile();
    const app = await module.createNestApplication().init();
    await request(app.getHttpServer())
      .get("/health")
      .expect(200)
      .expect({
        status: "ok",
        info: { sendgrid: { status: "up", apiStatus: "operational" } },
        error: {},
        details: { sendgrid: { status: "up", apiStatus: "operational" } },
      });

    await app.close();
  });
});
