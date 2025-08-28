import axios from "axios";

export default class WhatsappHandler {
  constructor(private sourceNumberId: string, private apiToken: string) {}

  async sendMessage(
    destionationNumber: string,
    message: string
  ): Promise<void> {
    const env = process.env.ENVIRONMENT || "dev";

    console.log(
      `Sending message to ${destionationNumber} via WhatsApp: ${message}`
    );

    if (env === "prod") {
      await axios.post(
        `https://graph.facebook.com/v22.0/${this.sourceNumberId}/messages`,
        {
          messaging_product: "whatsapp",
          to: destionationNumber,
          type: "text",
          text: {
            preview_url: false,
            body: message,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiToken}`,
            "Content-Type": "application/json",
          },
        }
      );
    }
  }
}
