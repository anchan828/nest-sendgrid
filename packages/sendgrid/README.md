# @anchan828/nest-sendgrid

## Supported Versions

* NestJS 8: v0.5.x
* NestJS 9: v0.6.x

## Description

The [@sendgrid/mail](https://github.com/sendgrid/sendgrid-nodejs/tree/master/packages/mail) module for [Nest](https://github.com/nestjs/nest).

This module is very simple.

## Installation

```bash
$ npm i --save @anchan828/nest-sendgrid
```

## Quick Start

```ts
import { SendGridModule } from "@anchan828/nest-sendgrid";
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [
    SendGridModule.forRoot({
      apikey: process.env.SENDGRID_API_KEY,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

```ts
import { SendGridService } from "@anchan828/nest-sendgrid";
import { Controller, Post } from "@nestjs/common";

@Controller()
export class AppController {
  constructor(private readonly sendGrid: SendGridService) {}

  @Post()
  async root(): Promise<void> {
    await this.sendGrid.send({
      to: "test@example.com",
      from: "test@example.com",
      subject: "Sending with SendGrid is Fun",
      text: "and easy to do anywhere, even with Node.js",
      html: "<strong>and easy to do anywhere, even with Node.js</strong>",
    });
  }
}
```

## License

[MIT](LICENSE).
