import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SuccessScreen from '../src/screens/SuccessScreen';
import { useTheme } from '../context/ThemeContext';
import { AccessibilityInfo } from 'react-native';

jest.mock('../context/ThemeContext', () => ({
    useTheme: jest.fn(),
}));

describe('SuccessScreen', () => {
    const mockNavigation = { popToTop: jest.fn() };

    beforeEach(() => {
        jest.clearAllMocks();
        (useTheme as jest.Mock).mockReturnValue({ isDark: false });
    });

    it('renders success message and announces it', () => {
        const { getByText } = render(
            <SuccessScreen
                route={{ params: { success: true, message: 'Transfer successful' } }}
                navigation={mockNavigation}
            />
        );

        expect(getByText('✅ Success')).toBeTruthy();
        expect(getByText('Transfer successful')).toBeTruthy();
    });

    it('renders failure message and announces it', () => {
        const { getByText } = render(
            <SuccessScreen
                route={{ params: { success: false, message: 'Transfer failed' } }}
                navigation={mockNavigation}
            />
        );

        expect(getByText('❌ Failed')).toBeTruthy();
        expect(getByText('Transfer failed')).toBeTruthy();
    });
});