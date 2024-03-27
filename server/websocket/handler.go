// handler.go
// Package websocket provides a WebSocket server implementation.
package websocket

import (
	"log"
	"net/http"
	"server/database"
	"server/types"
	"sync"
	"time"

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

func handleIncomingMessages(conn *websocket.Conn) {
	conn.SetPingHandler(func(appData string) error {
		// Send a pong in response to the ping
		return conn.WriteControl(websocket.PongMessage, []byte{}, time.Now().Add(time.Second))
	})

	// ticker - fires a tick at the specified increment
	ticker := time.NewTicker(time.Millisecond * 100)
	defer ticker.Stop()

	go func() {
		for range ticker.C {
			// At each tick, process all requests in the channel
			if len(requests) > 0 {
				for len(requests) > 0 {
					msg := <-requests
					processMessage(conn, msg)
				}
				// Call handleSyncPlayers after requests are processed
				mutex.Lock()
				handleSyncPlayers(connectedPlayers)
				mutex.Unlock()

			}
		}
	}()

	for {
		var msg types.Message
		err := conn.ReadJSON(&msg)
		if err != nil {
			log.Printf("Error reading message: %v", err)
			if websocket.IsCloseError(err, websocket.CloseNormalClosure, websocket.CloseGoingAway) {
				log.Println("WebSocket connection closed.")
			}
			return
		}

		// Instead of processing the message immediately, add it to the requests channel
		requests <- msg
	}
}

func closeConnection(conn *websocket.Conn) {
	conn.Close()

	// Remove the connection from the connectedPlayers map
	mutex.Lock()
	for id, connection := range connectedPlayers {
		if connection == conn {

			database.RemoveFromGrid("gameGrid.db", id)

			database.DeleteCharacter("characters.db", id)

			database.SyncPlayers(connectedPlayers)

			delete(connectedPlayers, id)
			break
		}
	}
	mutex.Unlock()

	log.Println("WebSocket connection closed.")
}
