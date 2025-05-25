export type SendMoneyResult = {
  success: boolean;
  message: string;
};

export const sendMoney = async (
  recipient: string,
  amount: number
): Promise<SendMoneyResult> => {
  return new Promise<SendMoneyResult>((resolve) => {
    setTimeout(() => {
      const success = Math.random() >= 0.5;
      resolve({
        success,
        message: success ? 'Transfer complete!' : 'Transfer failed. Try again.',
      });
    }, 1500);
  });
};