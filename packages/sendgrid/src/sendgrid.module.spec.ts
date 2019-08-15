import { Test } from "@nestjs/testing";
import { SendGridConstants } from "./sendgrid.constants";
import { SendGridModuleOptions, SendGridModuleOptionsFactory } from "./sendgrid.interfaces";
import { SendGridModule } from "./sendgrid.module";

describe("SendGridModule", () => {
  describe("forRoot", () => {
    it("should throw error when no set apikey", () => {
      expect(() => {
        SendGridModule.forRoot({} as SendGridModuleOptions);
      }).toThrowError("SendGrid API Key is not defined");
    });

    it("should return DynamicModule", () => {
      expect(
        SendGridModule.forRoot({
          apikey: "value",
        }),
      ).toStrictEqual({
        module: SendGridModule,
        providers: [
          {
            provide: SendGridConstants.SENDGRID_MODULE_OPTIONS,
            useValue: {
              apikey: "value",
            },
          },
        ],
      });
    });
  });
  describe("forRootAsync", () => {
    it("uses useFactory", () => {
      const dynamicModule = SendGridModule.forRootAsync({
        useFactory: () => ({
          apikey: "value",
        }),
      });
      expect(dynamicModule).toBeDefined();
      expect(dynamicModule.providers).toBeDefined();

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(Object.keys(dynamicModule.providers![0])).toStrictEqual(["provide", "useFactory", "inject"]);

      expect(dynamicModule).toMatchObject({
        imports: [],
        module: SendGridModule,
        providers: [
          {
            inject: [],
            provide: "SENDGRID_MODULE_OPTIONS",
          },
        ],
      });
    });

    it("uses useClass", async () => {
      class TestFactory implements SendGridModuleOptionsFactory {
        createSendGridModuleOptions(): SendGridModuleOptions {
          return {
            apikey: "value",
          };
        }
      }

      const dynamicModule = SendGridModule.forRootAsync({
        useClass: TestFactory,
      });
      expect(dynamicModule).toBeDefined();
      expect(dynamicModule.providers).toBeDefined();
      expect(dynamicModule).toMatchObject({
        module: SendGridModule,
        imports: [],
        providers: [
          { provide: "SENDGRID_MODULE_OPTIONS", inject: [TestFactory] },
          { provide: TestFactory, useClass: TestFactory, inject: [[]] },
        ],
      });

      await expect(
        Test.createTestingModule({
          imports: [dynamicModule],
        }).compile(),
      ).resolves.toBeDefined();
    });
  });
});
