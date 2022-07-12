# @anchan828/nest-sendgrid-terminus

## Supported Versions

* NestJS 8: v0.5.x
* NestJS 9: v0.6.x

## Description

The terminus of [@sendgrid/mail](https://github.com/sendgrid/sendgrid-nodejs/tree/master/packages/mail) module for [Nest](https://github.com/nestjs/nest).

## Installation

```bash
$ npm i --save @anchan828/nest-sendgrid-terminus @nestjs/terminus
```

## Quick Start

```ts
@Module({
  imports: [TerminusModule, SendGridHealthModule],
})
export class HealthModule {}

@Controller("health")
export class HealthController {
  constructor(private health: HealthCheckService, private sendgrid: SendGridHealthIndicator) {}

  @Get()
  @HealthCheck()
  readiness() {
    return this.health.check([async () => this.sendgrid.isHealthy()]);
  }
}
```

`/health` response

```json
{
  "status": "ok",
  "info": {
    "sendgrid": {
      "status": "up",
      "apiStatus": "operational"
    }
  },
  "error": {},
  "details": {
    "sendgrid": {
      "status": "up",
      "apiStatus": "operational"
    }
  }
}
```

## License

[MIT](LICENSE)
