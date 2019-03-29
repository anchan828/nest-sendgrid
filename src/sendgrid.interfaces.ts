import { Type } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';

export interface SendGridModuleOptions {
  apikey: string;
  substitutionWrappers?: { left: string; right: string };
}

export type SendGridModuleAsyncOptions = {
  useClass?: Type<SendGridModuleOptionsFactory>;
  /**
   * The factory which should be used to provide the SendGrid options
   */
  useFactory?: (
    ...args: unknown[]
  ) => Promise<SendGridModuleOptions> | SendGridModuleOptions;
  /**
   * The providers which should get injected
   */
  inject?: unknown[];
} & Pick<ModuleMetadata, 'imports'>;

export interface SendGridModuleOptionsFactory {
  createSendGridModuleOptions():
    | Promise<SendGridModuleOptions>
    | SendGridModuleOptions;
}
