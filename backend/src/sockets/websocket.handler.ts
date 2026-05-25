import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";

// In-memory mapping table linking assignment IDs to active client channels
export const activeSocketConnections = new Map<string, WebSocket>();

export const initializeWebSocketServer = (httpServer: Server) => {
  const wss = new WebSocketServer({ server: httpServer });

  wss.on("connection", (socket, request) => {
    const url = new URL(request.url || "", `http://${request.headers.host}`);
    const assignmentId = url.searchParams.get("assignmentId");

    if (assignmentId) {
      activeSocketConnections.set(assignmentId, socket);
    }

    socket.on("close", () => {
      if (assignmentId) activeSocketConnections.delete(assignmentId);
    });
  });
};

// Global helper to safely dispatch structured pipeline metrics down to the client layout
export const emitGenerationStatus = (assignmentId: string, status: string, progress: number, data: any = null) => {
  const clientSocket = activeSocketConnections.get(assignmentId);
  if (clientSocket && clientSocket.readyState === WebSocket.OPEN) {
    clientSocket.send(JSON.stringify({ status, progress, data }));
  }
};