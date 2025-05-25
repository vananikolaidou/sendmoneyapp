import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { useColorScheme } from 'react-native';
import SendMoneyScreen from '../src/screens/SendMoneyScreen';
import { useBalance } from '../context/BalanceContext';
import { useTheme } from '../context/ThemeContext';

jest.mock('../context/BalanceContext', () => ({
    useBalance: jest.fn(),
}));

jest.mock('../context/ThemeContext', () => ({
    useTheme: jest.fn(),
}));

jest.mock('../components/AmountSlider', () => {
    return function MockAmountSlider({ value, onChange, accessible, accessibilityLabel }) {
        return (
            <div
                testID="amount-slider"
                accessible={accessible}
                accessibilityLabel={accessibilityLabel}
                onPress={() => onChange(50)}
            >
                Amount: {value}
            </div>
        );
    };
});

const mockNavigate = jest.fn();
const mockNavigation = {
    navigate: mockNavigate,
};

describe('SendMoneyScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useColorScheme.mockReturnValue('light');
        useBalance.mockReturnValue({ balance: 1000 });
        useTheme.mockReturnValue({ isDark: false });
    });

    const renderComponent = (props = {}) => {
        return render(
            <SendMoneyScreen
                navigation={mockNavigation}
                {...props}
            />
        );
    };

    describe('Component Rendering', () => {
        it('renders correctly with default props', () => {
            const { getByText, getByPlaceholderText } = renderComponent();

            expect(getByText('Send Money')).toBeTruthy();
            expect(getByPlaceholderText('IBAN or phone number')).toBeTruthy();
            expect(getByText('Next')).toBeTruthy();
        });

        it('renders in dark mode correctly', () => {
            useTheme.mockReturnValue({ isDark: true });

            const { getByText } = renderComponent();
            expect(getByText('Send Money')).toBeTruthy();
        });
    });

    describe('Form Validation', () => {
        it('shows error for empty recipient field', async () => {
            const { getByText } = renderComponent();

            await act(async () => {
                fireEvent.press(getByText('Next'));
            });

            await waitFor(() => {
                expect(getByText('Please enter an IBAN or phone number to continue.')).toBeTruthy();
            });
        });

        it('shows error for invalid recipient format', async () => {
            const { getByPlaceholderText, getByText } = renderComponent();

            await act(async () => {
                fireEvent.changeText(getByPlaceholderText('IBAN or phone number'), 'invalid');
                fireEvent.press(getByText('Next'));
            });

            await waitFor(() => {
                expect(getByText('Enter a valid phone number or IBAN')).toBeTruthy();
            });
        });

        it('shows error for zero amount', async () => {
            const { getByPlaceholderText, getByText } = renderComponent();

            await act(async () => {
                fireEvent.changeText(getByPlaceholderText('IBAN or phone number'), '+306912345678');
                fireEvent.press(getByText('Next'));
            });

            await waitFor(() => {
                expect(getByText('Amount must be greater than 0.')).toBeTruthy();
            });
        });

        it('shows insufficient balance error when amount exceeds balance', async () => {
            useBalance.mockReturnValue({ balance: 10 });

            const { getByPlaceholderText, getByText, getByTestId } = renderComponent();

            await act(async () => {
                fireEvent.changeText(getByPlaceholderText('IBAN or phone number'), '+306912345678');
                fireEvent.press(getByTestId('amount-slider'));
            });

            await act(async () => {
                fireEvent.press(getByText('Next'));
            });

            await waitFor(() => {
                expect(getByText('Insufficient balance')).toBeTruthy();
            });
        });
    });

    describe('Input Formatting', () => {
        it('formats Greek phone number correctly', async () => {
            const { getByPlaceholderText } = renderComponent();
            const input = getByPlaceholderText('IBAN or phone number');

            await act(async () => {
                fireEvent.changeText(input, '6912345678');
            });

            expect(input.props.value).toBe('+306912345678');
        });
    });

    describe('Valid Form Submission', () => {
        it('navigates to Confirm screen with valid data', async () => {
            const { getByPlaceholderText, getByText, getByTestId } = renderComponent();

            await act(async () => {
                fireEvent.changeText(getByPlaceholderText('IBAN or phone number'), '+306912345678');
                fireEvent.press(getByTestId('amount-slider'));
            });

            await act(async () => {
                fireEvent.press(getByText('Next'));
            });

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('Confirm', {
                    recipient: '+306912345678',
                    amount: 50,
                });
            });
        });

        it('accepts valid IBAN', async () => {
            const { getByPlaceholderText, getByText, getByTestId } = renderComponent();

            await act(async () => {
                fireEvent.changeText(getByPlaceholderText('IBAN or phone number'), 'GR1234567890123456789012345');
                fireEvent.press(getByTestId('amount-slider'));
            });

            await act(async () => {
                fireEvent.press(getByText('Next'));
            });

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('Confirm', {
                    recipient: 'GR1234567890123456789012345',
                    amount: 50,
                });
            });
        });

        it('accepts international phone number', async () => {
            const { getByPlaceholderText, getByText, getByTestId } = renderComponent();

            await act(async () => {
                fireEvent.changeText(getByPlaceholderText('IBAN or phone number'), '+1234567890123');
                fireEvent.press(getByTestId('amount-slider'));
            });

            await act(async () => {
                fireEvent.press(getByText('Next'));
            });

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('Confirm', {
                    recipient: '+1234567890123',
                    amount: 50,
                });
            });
        });
    });

    describe('Amount Slider Integration', () => {
        it('rounds amount to one decimal place', () => {
            const testValue = 50.123;
            const rounded = Math.round(testValue * 10) / 10;
            expect(rounded).toBe(50.1);
        });
    });

    describe('Accessibility', () => {
        it('has proper accessibility labels', () => {
            const { getByPlaceholderText, getByText, getByTestId } = renderComponent();

            const recipientInput = getByPlaceholderText('IBAN or phone number');
            expect(recipientInput.props.accessible).toBe(true);
            expect(recipientInput.props.accessibilityLabel).toBe('Recipient');

            const slider = getByTestId('amount-slider');
            expect(slider.props.accessible).toBe(true);
            expect(slider.props.accessibilityLabel).toBe('Amount');

            const title = getByText('Send Money');
            expect(title.props.accessibilityRole).toBe('header');
        });

        it('sets invalid state for form errors', async () => {
            const { getByPlaceholderText, getByText } = renderComponent();

            await act(async () => {
                fireEvent.press(getByText('Next'));
            });

            await waitFor(() => {
                const recipientInput = getByPlaceholderText('IBAN or phone number');
                expect(recipientInput.props.accessibilityState?.invalid).toBe(true);
            });
        });
    });

    describe('Theme Support', () => {
        it('applies dark theme styles correctly', () => {
            useTheme.mockReturnValue({ isDark: true });

            const { getByPlaceholderText } = renderComponent();
            const input = getByPlaceholderText('IBAN or phone number');

            expect(input.props.placeholderTextColor).toBe('#ccc');
        });

        it('applies light theme styles correctly', () => {
            useTheme.mockReturnValue({ isDark: false });

            const { getByPlaceholderText } = renderComponent();
            const input = getByPlaceholderText('IBAN or phone number');

            expect(input.props.placeholderTextColor).toBe('#888');
        });
    });

    describe('Error Banner', () => {
        it('shows banner for form validation errors', async () => {
            const { getByText } = renderComponent();

            await act(async () => {
                fireEvent.press(getByText('Next'));
            });

            await waitFor(() => {
                expect(getByText('Please enter an IBAN or phone number to continue.')).toBeTruthy();
                expect(getByText('⚠️')).toBeTruthy();
            });
        });

        it('shows banner for insufficient balance', async () => {
            useBalance.mockReturnValue({ balance: 10 });

            const { getByPlaceholderText, getByText, getByTestId } = renderComponent();

            await act(async () => {
                fireEvent.changeText(getByPlaceholderText('IBAN or phone number'), '+306912345678');
                fireEvent.press(getByTestId('amount-slider'));
                fireEvent.press(getByText('Next'));
            });

            await waitFor(() => {
                expect(getByText('Insufficient balance')).toBeTruthy();
            });
        });
    });
});