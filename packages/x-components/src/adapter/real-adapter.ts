import { Banner } from '@empathyco/x-types';
import { EmpathyAdapterBuilder } from '@empathyco/x-adapter';
import { configureAdapterWithToysrus } from './util';

export const realAdapter = configureAdapterWithToysrus(
  new EmpathyAdapterBuilder().onResponseTransformed(({ response }) => {
    response.banners = [
      {
        id: 'banner1',
        modelName: 'Banner',
        url: 'https://www.toysrus.com/',
        image:
          'https://www.adobe.com/es/express/create/media_1eb9c473e101f7d31235a2a455b4a55b961be2ba8.jpeg?width=400&format=jpeg&optimize=medium',
        position: 2,
        tagging: {}
      } as Banner,
      {
        id: 'banner2',
        modelName: 'Banner',
        url: 'https://www.toysrus.com/',
        image:
          'https://www.bannerbatterien.com/upload/filecache/Banner-Batterien_Headerbilder-LKW_c69c957f00d8f3a12b4e048809a503ad.webp',
        position: 4,
        tagging: {}
      } as Banner
    ];
  }, 'search')
).build();
