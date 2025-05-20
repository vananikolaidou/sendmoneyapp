export const sendMoney = async (recipient: string, amount: number) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const success = Math.random() > 0.2;
      resolve({
        success,
        message: success ? 'Transfer complete!' : 'Transfer failed. Try again.',
      });
    }, 1500);
  });
};