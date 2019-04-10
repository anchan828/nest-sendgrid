# @anchan828/nest-sendgrid-terminus

## Description

The terminus of [@sendgrid/mail](https://github.com/sendgrid/sendgrid-nodejs/tree/master/packages/mail) module for [Nest](https://github.com/nestjs/nest).


## Installation

```bash
$ npm i --save @anchan828/nest-sendgrid-terminus @nestjs/terminus @godaddy/terminus
```

## Quick Start

```ts
const getTerminusOptions = (
  sendgrid: SendGridHealthIndicator,
): TerminusModuleOptions => ({
  endpoints: [
    {
      url: '/health',
      healthIndicators: [
        async () => sendgrid.isHealthy()
      ],
    },
  ],
});

@Module({
  imports:[
    TerminusModule.forRootAsync({
      imports: [SendGridHealthModule],
      inject: [SendGridHealthIndicator],
      useFactory: sendgrid => getTerminusOptions(sendgrid),
    }),
  ],
})
export class HealthModule { }
```

## License

[MIT](LICENSE)