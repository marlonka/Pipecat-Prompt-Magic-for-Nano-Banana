import { PipecatClient, PipecatProvider, usePipecat } from "@pipecat-ai/client-js";

class PipecatService {
  private client: PipecatClient;
  private onMessage: ((message: any) => void) | null = null;

  constructor() {
    this.client = new PipecatClient({
      url: "ws://localhost:8765",
    });

    this.client.on("message", (message) => {
      if (this.onMessage) {
        try {
          const parsedMessage = JSON.parse(message.data);
          this.onMessage(parsedMessage);
        } catch (error) {
          console.error("Failed to parse message from Pipecat bot:", error);
        }
      }
    });
  }

  connect(onConnected?: () => void) {
    this.client.on("open", () => {
      if (onConnected) {
        onConnected();
      }
    });
    this.client.connect();
  }

  disconnect() {
    this.client.disconnect();
  }

  sendMessage(message: any) {
    this.client.send(JSON.stringify(message));
  }

  onMessage(callback: (message: any) => void) {
    this.onMessage = callback;
  }
}

export const pipecatService = new PipecatService();
export { PipecatProvider, usePipecat };