import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Text, Button } from 'react-native';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

const TestComponent = () => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <>
            <Text testID="themeText">{isDark ? 'Dark' : 'Light'}</Text>
            <Button
                title="Toggle Theme"
                testID="toggleButton"
                onPress={toggleTheme}
            />
        </>
    );
};

describe('ThemeContext', () => {
    it('should default to light theme (isDark = false)', () => {
        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        expect(screen.getByTestId('themeText')).toHaveTextContent('Light');
    });

    it('should toggle theme to dark', () => {
        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        const button = screen.getByTestId('toggleButton');
        fireEvent.press(button);

        expect(screen.getByTestId('themeText')).toHaveTextContent('Dark');
    });

    it('should toggle back to light after two presses', () => {
        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        const button = screen.getByTestId('toggleButton');
        fireEvent.press(button);
        fireEvent.press(button);

        expect(screen.getByTestId('themeText')).toHaveTextContent('Light');
    });

    it('should throw error when useTheme is used outside provider', () => {
        const BrokenComponent = () => {
            useTheme();
            return <Text>Fail</Text>;
        };

        expect(() => render(<BrokenComponent />)).toThrow(
            'useTheme must be used within a ThemeProvider'
        );
    });
});