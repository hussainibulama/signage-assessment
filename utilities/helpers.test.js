import {cleanup} from '@testing-library/react-native';
import {getUrlExtension, downloadFile} from './helpers';

describe('Test helper functions', () => {
  afterEach(cleanup);

  it('test extension getter', () => {
    expect(
      getUrlExtension(
        'http://www.adobe.com/products/flashplayer/include/marquee/design.swf',
      ),
    ).toBe('swf');
  });
  it('test download_file function', () => {
    const url = jest.fn();
    const ext = jest.fn();
    expect(downloadFile(url, ext)).not.toBeNull();
  });
});
