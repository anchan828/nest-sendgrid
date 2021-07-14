import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { SendGridHealthIndicator } from "./sendgrid.health";

@Module({
  imports: [HttpModule],
  providers: [SendGridHealthIndicator],
  exports: [SendGridHealthIndicator],
})
export class SendGridHealthModule {}
