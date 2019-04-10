import { HealthCheckError } from '@godaddy/terminus';
import { HttpService, Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { COMPONENT_NAME, STATUS_API } from './constants';

@Injectable()
export class SendGridHealthIndicator extends HealthIndicator {
  constructor(private readonly http: HttpService) {
    super();
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    const res = await this.http
      .get(STATUS_API, {
        responseType: 'json',
      })
      .toPromise();

    const v3Status = res.data.components
      .map((component: { name: string; status: string }) => component)
      .find(
        (component: { name: string; status: string }) =>
          component.name === COMPONENT_NAME,
      );

    if (!v3Status) {
      throw new HealthCheckError(
        'SendGridHealthCheck failed',
        `${COMPONENT_NAME} component is not found. please access to http://status.sendgrid.com`,
      );
    }

    const isOperational = v3Status.status === 'operational';

    return this.getStatus('sendgrid', isOperational, {
      apiStatus: v3Status.status,
    });
  }
}
