import { Test } from '@nestjs/testing';
import * as sendgrid from '@sendgrid/mail';
import { SendGridConstants } from './sendgrid.constants';
import { SendGridModuleOptions } from './sendgrid.interfaces';
import { SendGridService } from './sendgrid.service';
describe('SendGridService', () => {
  it('should be compile', async () => {
    await expect(
      Test.createTestingModule({
        providers: [
          SendGridService,
          {
            provide: SendGridConstants.SENDGRID_MODULE_OPTIONS,
            useValue: { apikey: 'value' } as SendGridModuleOptions,
          },
        ],
      }).compile(),
    ).resolves.toBeDefined();
  });

  it('should be compile, but print error log', async () => {
    await expect(
      Test.createTestingModule({
        providers: [
          SendGridService,
          {
            provide: SendGridConstants.SENDGRID_MODULE_OPTIONS,
            useValue: {} as SendGridModuleOptions,
          },
        ],
      }).compile(),
    ).resolves.toBeDefined();
  });

  it('should set Substitution Wrappers', async () => {
    await expect(
      Test.createTestingModule({
        providers: [
          SendGridService,
          {
            provide: SendGridConstants.SENDGRID_MODULE_OPTIONS,
            useValue: {
              apikey: 'value',
              substitutionWrappers: {
                left: 'left',
                right: 'right',
              },
            } as SendGridModuleOptions,
          },
        ],
      }).compile(),
    ).resolves.toBeDefined();
  });

  it('should send email', async () => {
    const app = await Test.createTestingModule({
      providers: [
        SendGridService,
        {
          provide: SendGridConstants.SENDGRID_MODULE_OPTIONS,
          useValue: {
            apikey: 'value',
          } as SendGridModuleOptions,
        },
      ],
    }).compile();
    const service = app.get<SendGridService>(SendGridService);
    const mock = jest
      .spyOn(sendgrid, 'send')
      .mockImplementationOnce(async () => {
        return [{} as any, {}];
      });
    await service.send({
      to: 'test@example.com',
      from: 'test@example.com',
      subject: 'Sending with SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    });
    expect(mock).toHaveBeenCalled();
  });

  it('should set default data', async () => {
    const app = await Test.createTestingModule({
      providers: [
        SendGridService,
        {
          provide: SendGridConstants.SENDGRID_MODULE_OPTIONS,
          useValue: {
            apikey: 'value',
            defaultMailData: {
              from: 'test@example.com',
            },
          } as SendGridModuleOptions,
        },
      ],
    }).compile();
    const service = app.get<SendGridService>(SendGridService);
    const mock = jest
      .spyOn(sendgrid, 'send')
      .mockImplementationOnce(async data => {
        expect(data).toStrictEqual({
          to: 'test@example.com',
          from: 'test@example.com',
          subject: 'Sending with SendGrid is Fun',
          text: 'and easy to do anywhere, even with Node.js',
          html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        });
        return [{} as any, {}];
      });
    await service.send({
      to: 'test@example.com',
      subject: 'Sending with SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    });
    expect(mock).toHaveBeenCalled();
  });

  it('should send multiple', async () => {
    const app = await Test.createTestingModule({
      providers: [
        SendGridService,
        {
          provide: SendGridConstants.SENDGRID_MODULE_OPTIONS,
          useValue: {
            apikey: 'value',
          } as SendGridModuleOptions,
        },
      ],
    }).compile();
    const service = app.get<SendGridService>(SendGridService);
    const mock = jest
      .spyOn(sendgrid, 'sendMultiple')
      .mockImplementationOnce(async () => {
        return [{} as any, {}];
      });
    await service.sendMultiple({
      to: 'test@example.com',
      from: 'test@example.com',
      subject: 'Sending with SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    });
    expect(mock).toHaveBeenCalled();
  });
});
