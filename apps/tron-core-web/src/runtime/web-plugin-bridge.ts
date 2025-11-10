export interface PluginMessage {
  type: string;
  payload?: any;
}

export class WebPluginBridge {
  private channels: Map<string, MessagePort> = new Map();

  attach(pluginId: string, iframe: HTMLIFrameElement) {
    const channel = new MessageChannel();
    this.channels.set(pluginId, channel.port1);

    // Send port2 to plugin iframe
    iframe.contentWindow?.postMessage({ type: 'tron:connect', pluginId }, '*', [channel.port2]);

    // Example: listen for messages
    channel.port1.onmessage = (event) => {
      const msg = event.data as PluginMessage;
      if (msg?.type === 'tron:hello') {
        console.log(`[bridge] hello from ${pluginId}`, msg.payload);
      }
    };
    channel.port1.start();
  }

  send(pluginId: string, message: PluginMessage) {
    const port = this.channels.get(pluginId);
    port?.postMessage(message);
  }

  detach(pluginId: string) {
    const port = this.channels.get(pluginId);
    port?.close();
    this.channels.delete(pluginId);
  }
}