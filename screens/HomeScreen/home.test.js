import * as React from 'react';
import {render, screen, cleanup} from '@testing-library/react-native';
import HomeScreen from '.';
import {act} from 'react-dom/test-utils';

describe('Welcome screen test cases', () => {
  beforeEach(() => {
    navigation = {
      navigate: jest.fn(),
    };
  });
  afterEach(() => {
    // cleanup on exiting
    cleanup();
  });

  it('should render the HomeScreen', () => {
    HomeScreens = render(<HomeScreen navigation={navigation} />);
    expect(HomeScreens).toBeTruthy();
  });
  it('should render view container', () => {
    render(<HomeScreen navigation={navigation} />);
    const fullScreenContainer = screen.getByTestId('view-container');
    expect(fullScreenContainer).toBeTruthy();
  });
  it('should render view container', () => {
    render(<HomeScreen navigation={navigation} />);
    const fullScreenContainer = screen.getByTestId('view-container');
    expect(fullScreenContainer).toBeTruthy();
  });
  it('should render error message when it occurs', async () => {
    act(() => {
      render(<HomeScreen isError={true} navigation={navigation} />);
    });
    const errorMessage = await screen.getByTestId('errorText');
    expect(errorMessage).toBeTruthy();
  });
  it('should display indicator and loading message to users when retrieving content', async () => {
    act(() => {
      render(<HomeScreen isSearching={true} navigation={navigation} />);
    });
    const iconIndicator = await screen.getByTestId('indicator-id');
    const loaderMsg = await screen.getByTestId('loader-text');
    expect(iconIndicator).toBeTruthy();
    expect(loaderMsg).toBeTruthy();
  });
  it('should display indicator and loading message to users when retrieving content', async () => {
    act(() => {
      render(<HomeScreen isSearching={true} navigation={navigation} />);
    });
    const iconIndicator = await screen.getByTestId('indicator-id');
    const loaderMsg = await screen.getByTestId('loader-text');
    expect(iconIndicator).toBeTruthy();
    expect(loaderMsg).toBeTruthy();
  });
  it('should display in sequence image and video from mockdata', async () => {
    jest.setTimeout(10000);
    act(() => {
      render(<HomeScreen initialData={mockData} navigation={navigation} />);
    });
    const imageDisplay = await screen.getByTestId('image-id');
    expect(imageDisplay).toBeTruthy();
    await act(() =>
      Promise.resolve(new Promise((wait) => setTimeout(wait, 5000))),
    );
    const videoDisplay = await screen.getByTestId('video-id');
    expect(videoDisplay).toBeTruthy();
  });
});

const mockData = [
  {
    fileURL:
      'file:///data/user/0/host.exp.exponent/files/ExperienceData/%2540hussainibulama%252FNowSinage/1676700917813.jpg',
    type: 'image',
    url: 'https://media.nowsignage.com/2021/05/19/12/01/29/96cc723c-1ca9-467e-baec-2d011c8778e3/2.jpg',
  },
  {
    fileURL:
      'file:///data/user/0/host.exp.exponent/files/ExperienceData/%2540hussainibulama%252FNowSinage/1676700917817.webm',
    type: 'video',
    url: 'https://media.nowsignage.com/2022/03/08/17/06/25/e069ac44-7eab-4576-bae5-ca8f981520ac/vp9/video.webm',
  },
  {
    fileURL:
      'file:///data/user/0/host.exp.exponent/files/ExperienceData/%2540hussainibulama%252FNowSinage/1676700917819.jpg',
    type: 'image',
    url: 'https://media.nowsignage.com/2021/05/19/12/01/29/1581886e-5a36-4318-af38-cde1d7682827/6_2.jpg',
  },
];
