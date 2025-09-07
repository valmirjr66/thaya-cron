import httpCallers from "../services/index.js";

export default class TelegramHandler {
  constructor(
    private readonly token: string,
    private readonly environment: string
  ) {}

  async sendMessage(chatId: number, content: string): Promise<void> {
    console.log(
      `[TelegramHandler] Attempting to send message to chatId: ${chatId}`
    );
    console.log(`[TelegramHandler] Environment: ${this.environment}`);
    console.log(`[TelegramHandler] Message content: ${content}`);

    if (this.environment === "prod") {
      try {
        const response = await httpCallers.post(
          `https://api.telegram.org/bot${this.token}/sendMessage`,
          {
            chat_id: chatId,
            text: content,
          }
        );
        console.log(
          `[TelegramHandler] Message sent successfully. Response:`,
          response.data
        );
      } catch (error) {
        console.error(`[TelegramHandler] Failed to send message:`, error);
      }
    } else {
      console.log(
        `[TelegramHandler] Not sending message because environment is not 'prod'.`
      );
    }
  }
}
