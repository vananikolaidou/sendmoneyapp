import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../src/screens/HomeScreen';
import { ThemeProvider } from '../context/ThemeContext';
import { BalanceProvider } from '../context/BalanceContext';

describe('HomeScreen', () => {
  const mockNavigate = jest.fn();

  const renderWithProviders = () =>
    render(
      <BalanceProvider>
        <ThemeProvider>
          <HomeScreen navigation={{ navigate: mockNavigate }} />
        </ThemeProvider>
      </BalanceProvider>
    );

  it('renders balance and headings correctly', () => {
    const { getByText } = renderWithProviders();

    expect(getByText('Welcome Back')).toBeTruthy();
    expect(getByText('Send money safely and easily')).toBeTruthy();
    expect(getByText(/€\d+\.\d{2}/)).toBeTruthy(); // balance
  });

  it('navigates to SendMoney screen on button press', () => {
    const { getByText } = renderWithProviders();

    fireEvent.press(getByText('Send Money'));
    expect(mockNavigate).toHaveBeenCalledWith('SendMoney');
  });
});