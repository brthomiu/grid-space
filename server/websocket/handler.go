// handler.go
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
	mutex            = &sync.Mutex{}
	connectedPlayers = make(map[string]*websocket.Conn) // Store IDs of connected players on server
	upgrader         = websocket.Upgrader{              // Upgrader for upgrading HTTP connections to WebSocket

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

	// Handle incoming messages
	handleIncomingMessages(conn)
}

func closeConnection(conn *websocket.Conn) {
	conn.Close()

	// Remove the connection from the connectedPlayers map
	mutex.Lock()
	for id, connection := range connectedPlayers {
		if connection == conn {
			delete(connectedPlayers, id)
			break
		}
	}
	mutex.Unlock()

	log.Println("WebSocket connection closed.")
}
