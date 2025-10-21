import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';

import { EnvService } from './env.service';

describe('EnvService', () => {
  let envService: EnvService;
  let cfgService: ConfigService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        EnvService,
        {
          provide: ConfigService,
          useFactory: () => ({
            get: jest.fn(),
          }),
        },
      ],
    }).compile();

    envService = moduleRef.get<EnvService>(EnvService);
    cfgService = moduleRef.get<ConfigService>(ConfigService);
  });

  it('assures service is defined', () => {
    expect(envService).toBeDefined();
  });

  describe('get()', () => {
    it('returns correct value from ConfigService', () => {
      const getSpy = jest.spyOn(cfgService, 'get').mockReturnValue(1234);
      const key = 'PORT';

      const value = envService.get(key);

      expect(getSpy).toHaveBeenCalledWith(
        key,
        expect.objectContaining({ infer: true }),
      );
      expect(value).toBe(1234);
    });
  });
});
