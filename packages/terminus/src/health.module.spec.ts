import { Module } from '@nestjs/common';
import { TerminusModule, TerminusModuleOptions } from '@nestjs/terminus';
import { Test } from '@nestjs/testing';
import { SendGridHealthModule } from './health.module';
import { SendGridHealthIndicator } from './sendgrid.health';

describe('SendGridHealthModule', () => {
  it('should compile module', async () => {
    await expect(
      Test.createTestingModule({ imports: [SendGridHealthModule] }).compile(),
    ).resolves.toBeDefined();
  });

  it('should compile health module', async () => {
    const getTerminusOptions = (
      sendgrid: SendGridHealthIndicator,
    ): TerminusModuleOptions => ({
      endpoints: [
        {
          url: '/health',
          healthIndicators: [async () => sendgrid.isHealthy()],
        },
      ],
    });
    @Module({
      imports: [
        TerminusModule.forRootAsync({
          imports: [SendGridHealthModule],
          inject: [SendGridHealthIndicator],
          useFactory: (sendgrid: any) => getTerminusOptions(sendgrid),
        }),
      ],
    })
    class HealthModule {}

    await expect(
      Test.createTestingModule({ imports: [HealthModule] }).compile(),
    ).resolves.toBeDefined();
  });

  it('should get SendGridHealthIndicator', async () => {
    const app = await Test.createTestingModule({
      imports: [SendGridHealthModule],
    }).compile();

    expect(
      app.get<SendGridHealthIndicator>(SendGridHealthIndicator),
    ).toBeDefined();
  });
});
