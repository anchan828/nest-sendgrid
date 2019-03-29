import { Inject, Injectable } from '@nestjs/common';
import { ClientResponse } from '@sendgrid/client/src/response';
import { ResponseError } from '@sendgrid/helpers/classes';
import { MailData } from '@sendgrid/helpers/classes/mail';
import {
  send,
  sendMultiple,
  setApiKey,
  setSubstitutionWrappers,
} from '@sendgrid/mail';
import { SendGridConstants } from './sendgrid.constants';
import { SendGridModuleOptions } from './sendgrid.interfaces';
import { logger } from './sendgrid.logger';

@Injectable()
export class SendGridService {
  constructor(
    @Inject(SendGridConstants.SENDGRID_MODULE_OPTIONS)
    private readonly options: SendGridModuleOptions,
  ) {
    if (!(options && options.apikey)) {
      logger.error('options not found. Did you use SendGridModule.forRoot?');
      return;
    }

    if (options.apikey) {
      setApiKey(options.apikey);
      logger.log('Set API Key');
    }

    if (
      options.substitutionWrappers &&
      options.substitutionWrappers.left &&
      options.substitutionWrappers.right
    ) {
      setSubstitutionWrappers(
        options.substitutionWrappers.left,
        options.substitutionWrappers.right,
      );
      logger.log('Set Substitution Wrappers');
    }
  }

  public async send(
    data: MailData | MailData[],
    isMultiple?: boolean,
    cb?: (err: Error | ResponseError, result: [ClientResponse, {}]) => void,
  ): Promise<[ClientResponse, {}]> {
    // @ts-ignore
    return send(data, isMultiple, cb);
  }

  public async sendMultiple(
    data: MailData,
    cb?: (error: Error | ResponseError, result: [ClientResponse, {}]) => void,
  ): Promise<[ClientResponse, {}]> {
    return sendMultiple(data, cb);
  }
}
