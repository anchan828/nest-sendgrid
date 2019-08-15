import { HttpModule, Module } from "@nestjs/common";
import { SendGridHealthIndicator } from "./sendgrid.health";

@Module({
  imports: [HttpModule],
  providers: [SendGridHealthIndicator],
  exports: [SendGridHealthIndicator],
})
export class SendGridHealthModule {}
