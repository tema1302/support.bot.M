// Import the function to be tested
const { proceedToStep } = require('./individual');

// Mock dependencies
const bot = {
  sendMessage: jest.fn(),
};
const chatId = '123456';
const backButton_withAgree = jest.fn();

describe('proceedToStep', () => {
  beforeEach(() => {
    // Clear mock function calls before each test
    bot.sendMessage.mockClear();
    backButton_withAgree.mockClear();
  });

  it('should display connection options when step is IDLE', async () => {
    // Arrange
    const step = 'IDLE';

    // Act
    await proceedToStep(bot, chatId, step);

    // Assert
    expect(bot.sendMessage).toHaveBeenCalledWith(chatId, expect.anything());
    expect(backButton_withAgree).toHaveBeenCalled();
  });

  it('should ask for the user\'s name when step is AWAITING_NAME', async () => {
    // Arrange
    const step = 'AWAITING_NAME';

    // Act
    await proceedToStep(bot, chatId, step);

    // Assert
    expect(bot.sendMessage).toHaveBeenCalledWith(chatId, 'Введите ваше имя.', expect.anything());
    expect(backButton_withAgree).toHaveBeenCalled();
  });

  // Add more test cases for other steps...

  it('should reset user state and information when step is MESSAGE_WAS_SENT', async () => {
    // Arrange
    const step = 'MESSAGE_WAS_SENT';

    // Act
    await proceedToStep(bot, chatId, step);

    // Assert
    expect(bot.sendMessage).toHaveBeenCalledWith(chatId, expect.anything());
    expect(resetUserState).toHaveBeenCalledWith(chatId);
  });
});
