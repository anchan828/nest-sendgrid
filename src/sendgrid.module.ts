import { DynamicModule, Logger, Module } from '@nestjs/common';
import { SendGridConstants } from './sendgrid.constants';
import { SendGridModuleOptions } from './sendgrid.interfaces';
import { SendGridService } from './sendgrid.service';

@Module({
  providers: [SendGridService],
  exports: [SendGridService],
})
export class SendGridModule {
  public static forRoot(options: SendGridModuleOptions): DynamicModule {
    if (!(options && options.apikey)) {
      Logger.error(
        'SendGrid API Key is not defined.',
        SendGridConstants.SENDGRID_MODULE,
      );
    }

    return {
      module: SendGridModule,
      providers: [
        {
          provide: SendGridConstants.SENDGRID_MODULE_OPTIONS,
          useValue: options,
        },
      ],
    };
  }
}
