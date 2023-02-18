import * as React from 'react';
import {
  render,
  screen,
  fireEvent,
  cleanup,
} from '@testing-library/react-native';
import WelcomeScreen from '.';
import {act} from 'react-dom/test-utils';

describe('Welcome screen test cases', () => {
  beforeEach(() => {
    navigation = {
      navigate: jest.fn(),
    };
    WelcomeScreens = render(<WelcomeScreen navigation={navigation} />);
  });
  afterEach(cleanup);

  it('should render the WelcomeScreens', () => {
    expect(WelcomeScreens).toBeTruthy();
  });
  it('should render Welcome back! lets get you in', () => {
    const welcomeText = screen.getByText('Welcome back! lets get you in');
    expect(welcomeText).toBeTruthy();
  });
  it('should render textinput and button', () => {
    const pinInput = screen.getByPlaceholderText('Enter pin');
    const Button = screen.getByText('Continue');
    expect(pinInput).toBeTruthy();
    expect(Button).toBeTruthy();
  });
  it('should display error if invalid pin is passed', async () => {
    const pinInput = screen.getByPlaceholderText('Enter pin');
    const Button = screen.getByText('Continue');
    fireEvent.changeText(pinInput, '123456');
    await act(() => Promise.resolve(fireEvent.press(Button)));
    const errorText = await screen.getByText('Invalid pin entered');
    expect(errorText).toBeTruthy();
  });
  it('should not submit empty form', async () => {
    const Button = screen.getByText('Continue');
    await act(() => Promise.resolve(fireEvent.press(Button)));
    const errorText = await screen.getByText('Valid pin is required');
    expect(errorText).toBeTruthy();
  });
  it('should accept valid pin and navigate', async () => {
    const pinInput = screen.getByPlaceholderText('Enter pin');
    const Button = screen.getByText('Continue');
    fireEvent.changeText(pinInput, '00000');
    await act(() => Promise.resolve(fireEvent.press(Button)));
    expect(navigation.navigate).toHaveBeenCalledWith('Home');
  });
});
