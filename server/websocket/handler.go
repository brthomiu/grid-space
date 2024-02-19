// Package websocket provides a WebSocket server implementation.
package websocket

import (
	"log"
	"net/http"
	"server/types"
	"sync"

	"github.com/gorilla/websocket"
)

// Global variables for broadcasting messages to all clients
var (
	broadcastChannel = make(chan types.Message, 500) // Channel for broadcasting messages to all clients
	clients          sync.Map                        // Concurrent map to store client connections
	upgrader         = websocket.Upgrader{           // Upgrader for upgrading HTTP connections to WebSocket
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
)

func HandleWebSocketConnection(w http.ResponseWriter, r *http.Request) {
	// Upgrade the HTTP connection to a WebSocket connection
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("Error upgrading to WebSocket: %v", err)
		return
	}

	// Ensure the connection is closed when the function returns
	defer closeConnection(conn)

	// Store the connection in the clients map
	clients.Store(conn, true)

	// Handle incoming messages
	handleIncomingMessages(conn)
}

func closeConnection(conn *websocket.Conn) {
	conn.Close()
	clients.Delete(conn)
	log.Println("WebSocket connection closed.")
}
