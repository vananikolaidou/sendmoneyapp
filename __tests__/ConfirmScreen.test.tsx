import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { useColorScheme } from 'react-native';
import ConfirmScreen from '../src/screens/ConfirmScreen';
import { useRoute, useNavigation } from '@react-navigation/native';
import { sendMoney } from '../api/mockApi';
import { useBalance } from '../context/BalanceContext';
import { useTheme } from '../context/ThemeContext';

jest.mock('@react-navigation/native', () => ({
    useRoute: jest.fn(),
    useNavigation: jest.fn(),
}));

jest.mock('../api/mockApi', () => ({
    sendMoney: jest.fn(),
}));

jest.mock('../context/BalanceContext', () => ({
    useBalance: jest.fn(),
}));

jest.mock('../context/ThemeContext', () => ({
    useTheme: jest.fn(),
}));

describe('ConfirmScreen', () => {
    const mockNavigate = jest.fn();
    const mockDeductBalance = jest.fn();

    const defaultRouteParams = {
        recipient: '+306912345678',
        amount: 50.5,
    };

    beforeEach(() => {
        jest.clearAllMocks();

        useNavigation.mockReturnValue({
            navigate: mockNavigate,
        });

        useRoute.mockReturnValue({
            params: defaultRouteParams,
        });

        useColorScheme.mockReturnValue('light');
        useTheme.mockReturnValue({ isDark: false });
        useBalance.mockReturnValue({ deductBalance: mockDeductBalance });

        sendMoney.mockResolvedValue({
            success: true,
            message: 'Transfer successful',
        });
    });

    const renderComponent = () => {
        return render(<ConfirmScreen />);
    };

    describe('Component Rendering', () => {
        it('renders correctly with default props', () => {
            const { getByText } = renderComponent();

            expect(getByText('Confirm Transfer')).toBeTruthy();
            expect(getByText('Recipient:')).toBeTruthy();
            expect(getByText('+306912345678')).toBeTruthy();
            expect(getByText('Amount:')).toBeTruthy();
            expect(getByText('€50.5')).toBeTruthy();
            expect(getByText('Confirm & Send')).toBeTruthy();
        });

        it('displays recipient information correctly', () => {
            useRoute.mockReturnValue({
                params: {
                    recipient: 'GR1234567890123456789012345',
                    amount: 100,
                },
            });

            const { getByText } = renderComponent();

            expect(getByText('GR1234567890123456789012345')).toBeTruthy();
            expect(getByText('€100')).toBeTruthy();
        });

        it('displays amount with decimal places correctly', () => {
            useRoute.mockReturnValue({
                params: {
                    recipient: '+306912345678',
                    amount: 123.45,
                },
            });

            const { getByText } = renderComponent();
            expect(getByText('€123.45')).toBeTruthy();
        });

        it('displays whole number amounts correctly', () => {
            useRoute.mockReturnValue({
                params: {
                    recipient: '+306912345678',
                    amount: 100,
                },
            });

            const { getByText } = renderComponent();
            expect(getByText('€100')).toBeTruthy();
        });
    });

    describe('Theme Support', () => {
        it('renders correctly in light mode', () => {
            useTheme.mockReturnValue({ isDark: false });

            const { getByText } = renderComponent();
            expect(getByText('Confirm Transfer')).toBeTruthy();
        });

        it('renders correctly in dark mode', () => {
            useTheme.mockReturnValue({ isDark: true });

            const { getByText } = renderComponent();
            expect(getByText('Confirm Transfer')).toBeTruthy();
        });
    });

    describe('Successful Money Transfer', () => {
        it('calls sendMoney API when confirm button is pressed', async () => {
            const { getByText } = renderComponent();
            const confirmButton = getByText('Confirm & Send');

            await act(async () => {
                fireEvent.press(confirmButton);
            });

            expect(sendMoney).toHaveBeenCalledWith('+306912345678', 50.5);
            expect(sendMoney).toHaveBeenCalledTimes(1);
        });

        it('deducts balance on successful transfer', async () => {
            sendMoney.mockResolvedValue({
                success: true,
                message: 'Transfer completed successfully',
            });

            const { getByText } = renderComponent();
            const confirmButton = getByText('Confirm & Send');

            await act(async () => {
                fireEvent.press(confirmButton);
            });

            await waitFor(() => {
                expect(mockDeductBalance).toHaveBeenCalledWith(50.5);
                expect(mockDeductBalance).toHaveBeenCalledTimes(1);
            });
        });

        it('navigates to Success screen with success result', async () => {
            sendMoney.mockResolvedValue({
                success: true,
                message: 'Transfer completed successfully',
            });

            const { getByText } = renderComponent();
            const confirmButton = getByText('Confirm & Send');

            await act(async () => {
                fireEvent.press(confirmButton);
            });

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('Success', {
                    success: true,
                    message: 'Transfer completed successfully',
                });
                expect(mockNavigate).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe('Failed Money Transfer', () => {
        it('does not deduct balance on failed transfer', async () => {
            sendMoney.mockResolvedValue({
                success: false,
                message: 'Transfer failed - insufficient funds',
            });

            const { getByText } = renderComponent();
            const confirmButton = getByText('Confirm & Send');

            await act(async () => {
                fireEvent.press(confirmButton);
            });

            await waitFor(() => {
                expect(mockDeductBalance).not.toHaveBeenCalled();
            });
        });

        it('navigates to Success screen with failure result', async () => {
            sendMoney.mockResolvedValue({
                success: false,
                message: 'Transfer failed - recipient not found',
            });

            const { getByText } = renderComponent();
            const confirmButton = getByText('Confirm & Send');

            await act(async () => {
                fireEvent.press(confirmButton);
            });

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('Success', {
                    success: false,
                    message: 'Transfer failed - recipient not found',
                });
            });
        });
    });

    describe('API Error Handling', () => {
        it('handles malformed API response', async () => {
            sendMoney.mockResolvedValue({
                message: 'Some message',
            });

            const { getByText } = renderComponent();
            const confirmButton = getByText('Confirm & Send');

            await act(async () => {
                fireEvent.press(confirmButton);
            });

            expect(mockDeductBalance).not.toHaveBeenCalled();
        });
    });

    describe('Route Parameters', () => {
        it('handles different recipient formats', () => {
            const testCases = [
                { recipient: '+306912345678', amount: 50 },
                { recipient: 'GR1234567890123456789012345', amount: 75.25 },
                { recipient: '+1234567890123', amount: 100.99 },
            ];

            testCases.forEach(({ recipient, amount }) => {
                useRoute.mockReturnValue({
                    params: { recipient, amount },
                });

                const { getByText } = renderComponent();
                expect(getByText(recipient)).toBeTruthy();
                expect(getByText(`€${amount}`)).toBeTruthy();
            });
        });

        it('handles missing route parameters gracefully', () => {
            useRoute.mockReturnValue({
                params: {},
            });

            expect(() => renderComponent()).not.toThrow();
        });
    });

    describe('Accessibility', () => {
        it('has proper accessibility properties for main container', () => {
            const { getByLabelText } = renderComponent();

            const container = getByLabelText('Confirm Transfer Screen');
            expect(container.props.accessible).toBe(true);
            expect(container.props.accessibilityLabel).toBe('Confirm Transfer Screen');
            expect(container.props.accessibilityHint).toBe('Review the transfer details and confirm to send money');
        });

        it('has proper accessibility role for title', () => {
            const { getByText } = renderComponent();

            const title = getByText('Confirm Transfer');
            expect(title.props.accessibilityRole).toBe('header');
            expect(title.props.accessibilityLabel).toBe('Confirm Transfer');
        });

        it('has proper accessibility properties for transfer details card', () => {
            const { getByLabelText } = renderComponent();

            const card = getByLabelText('Transfer details');
            expect(card.props.accessibilityRole).toBe('summary');
            expect(card.props.accessibilityLabel).toBe('Transfer details');
        });

        it('has descriptive accessibility labels for recipient and amount', () => {
            const { getByLabelText } = renderComponent();

            expect(getByLabelText('Recipient account or phone number: +306912345678')).toBeTruthy();
            expect(getByLabelText('Amount to send: €50.5')).toBeTruthy();
        });
    });

    describe('Integration Tests', () => {
        it('completes full successful transfer flow', async () => {
            sendMoney.mockResolvedValue({
                success: true,
                message: 'Money sent successfully',
            });

            const { getByText } = renderComponent();
            const confirmButton = getByText('Confirm & Send');

            await act(async () => {
                fireEvent.press(confirmButton);
            });

            await waitFor(() => {
                expect(sendMoney).toHaveBeenCalledWith('+306912345678', 50.5);

                expect(mockDeductBalance).toHaveBeenCalledWith(50.5);

                expect(mockNavigate).toHaveBeenCalledWith('Success', {
                    success: true,
                    message: 'Money sent successfully',
                });
            });
        });

        it('completes full failed transfer flow', async () => {
            sendMoney.mockResolvedValue({
                success: false,
                message: 'Insufficient funds',
            });

            const { getByText } = renderComponent();
            const confirmButton = getByText('Confirm & Send');

            await act(async () => {
                fireEvent.press(confirmButton);
            });

            await waitFor(() => {
                expect(sendMoney).toHaveBeenCalledWith('+306912345678', 50.5);

                expect(mockDeductBalance).not.toHaveBeenCalled();

                expect(mockNavigate).toHaveBeenCalledWith('Success', {
                    success: false,
                    message: 'Insufficient funds',
                });
            });
        });
    });

    describe('Multiple Button Presses', () => {
        it('handles multiple rapid button presses gracefully', async () => {
            sendMoney.mockResolvedValue({
                success: true,
                message: 'Transfer successful',
            });

            const { getByText } = renderComponent();
            const confirmButton = getByText('Confirm & Send');

            await act(async () => {
                fireEvent.press(confirmButton);
                fireEvent.press(confirmButton);
                fireEvent.press(confirmButton);
            });

            await waitFor(() => {
                expect(sendMoney).toHaveBeenCalledTimes(3);
                expect(mockDeductBalance).toHaveBeenCalledTimes(3);
                expect(mockNavigate).toHaveBeenCalledTimes(3);
            });
        });
    });

    describe('Edge Cases', () => {
        it('handles zero amount', () => {
            useRoute.mockReturnValue({
                params: {
                    recipient: '+306912345678',
                    amount: 0,
                },
            });

            const { getByText } = renderComponent();
            expect(getByText('€0')).toBeTruthy();
        });

        it('handles negative amount', () => {
            useRoute.mockReturnValue({
                params: {
                    recipient: '+306912345678',
                    amount: -50,
                },
            });

            const { getByText } = renderComponent();
            expect(getByText('€-50')).toBeTruthy();
        });

        it('handles very large amounts', () => {
            useRoute.mockReturnValue({
                params: {
                    recipient: '+306912345678',
                    amount: 999999999.99,
                },
            });

            const { getByText } = renderComponent();
            expect(getByText('€999999999.99')).toBeTruthy();
        });

        it('handles empty recipient string', () => {
            useRoute.mockReturnValue({
                params: {
                    recipient: '',
                    amount: 50,
                },
            });

            const { getByText, getByLabelText } = renderComponent();
            expect(getByLabelText('Recipient account or phone number: ')).toBeTruthy();
        });
    });
});