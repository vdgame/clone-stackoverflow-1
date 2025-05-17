import type { APIRoute } from 'astro';
import { getSession } from 'auth-astro/server';

// In-memory store of connected clients
// In a production app, this would be replaced with Redis or similar
interface SSEClient {
  id: string;
  controller: ReadableStreamDefaultController;
}

const clients: SSEClient[] = [];

// Function to broadcast messages to all connected clients
export const broadcastUpdate = (type: 'question' | 'answer', data: any) => {
  const eventData = JSON.stringify({ type, data });
  clients.forEach(client => {
    try {
      client.controller.enqueue(`data: ${eventData}\n\n`);
    } catch (e) {
      // Client might be disconnected
      console.error(`Error sending to client ${client.id}:`, e);
    }
  });
};

export const GET: APIRoute = async ({ request }) => {
  // Get the current session
  const session = await getSession(request);

  // Set up SSE response headers
  const responseHeaders = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  };

  // Create a new stream
  const stream = new ReadableStream({
    start(controller) {
      // Generate a unique client ID
      const clientId = crypto.randomUUID();

      // Add new client to the list
      clients.push({ id: clientId, controller });

      // Send initial connection message
      controller.enqueue(`data: ${JSON.stringify({ type: 'connected', clientId })}\n\n`);

      // Remove client on stream close
      request.signal.addEventListener('abort', () => {
        const index = clients.findIndex(client => client.id === clientId);
        if (index !== -1) {
          clients.splice(index, 1);
        }
      });
    }
  });

  return new Response(stream, {
    headers: responseHeaders
  });
};

// Helper function to send updates for new questions and answers
// This will be called from other API endpoints when content is created
export const sendContentUpdate = (type: 'question' | 'answer', data: any) => {
  broadcastUpdate(type, data);
};
