import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Text, Button } from 'react-native';
import { BalanceProvider, useBalance } from '../context/BalanceContext';

const TestComponent = () => {
    const { balance, deductBalance } = useBalance();

    return (
        <>
            <Text testID="balance">{balance}</Text>
            <Button
                testID="deductButton"
                title="Deduct"
                onPress={() => deductBalance(500)}
            />
        </>
    );
};

describe('BalanceContext', () => {
    it('should provide initial balance of 10000', () => {
        render(
            <BalanceProvider>
                <TestComponent />
            </BalanceProvider>
        );
        expect(screen.getByTestId('balance')).toHaveTextContent('10000');
    });

    it('should deduct amount from balance', () => {
        render(
            <BalanceProvider>
                <TestComponent />
            </BalanceProvider>
        );

        const button = screen.getByTestId('deductButton');
        fireEvent.press(button);
        fireEvent.press(button);

        expect(screen.getByTestId('balance')).toHaveTextContent('9000');
    });

    it('should not allow negative balance', () => {
        render(
            <BalanceProvider>
                <TestComponent />
            </BalanceProvider>
        );

        const button = screen.getByTestId('deductButton');
        for (let i = 0; i < 25; i++) {
            fireEvent.press(button);
        }

        expect(screen.getByTestId('balance')).toHaveTextContent('0');
    });
});