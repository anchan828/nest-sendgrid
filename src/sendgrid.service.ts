import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientResponse } from '@sendgrid/client/src/response';
import { ResponseError } from '@sendgrid/helpers/classes';
import { MailData } from '@sendgrid/helpers/classes/mail';
import { send, sendMultiple, setApiKey, setSubstitutionWrappers } from '@sendgrid/mail';
import { SendGridConstants } from './sendgrid.constants';
import { SendGridModuleOptions } from './sendgrid.interfaces';

@Injectable()
export class SendGridService {

  constructor(
    @Inject(SendGridConstants.SENDGRID_MODULE_OPTIONS)
    private readonly options: SendGridModuleOptions,
  ) {
    if (!options) {
      return;
    }

    if (options.apikey) {
      setApiKey(options.apikey);
      Logger.log('Set API Key', SendGridConstants.SENDGRID_MODULE, true);
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
      Logger.log(
        'Set Substitution Wrappers',
        SendGridConstants.SENDGRID_MODULE,
        true,
      );
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
