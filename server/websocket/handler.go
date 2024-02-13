// Package websocket provides a WebSocket server implementation.
package websocket

import (
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

// Message represents the structure of the messages sent over the WebSocket.
type Message struct {
	Value int `json:"value"`
}

// Global variables for broadcasting messages to all clients
var (
	broadcastChannel = make(chan Message, 500) // Channel for broadcasting messages to all clients
	clients          sync.Map                  // Concurrent map to store client connections
	counter          int                       // Counter for cycling through values
	counterMutex     sync.Mutex                // Mutex for synchronizing access to the counter
	cyclingValues    = []int{3, 4, 5, 6}       // Values to cycle through
	upgrader         = websocket.Upgrader{     // Upgrader for upgrading HTTP connections to WebSocket
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
	ticker = time.NewTicker(10 * time.Second) // Ticker for generating new values every (n * seconds)
	done   = make(chan struct{})              // Channel to signal the ticker goroutine to exit
)

// HandleWebSocketConnection upgrades HTTP connections to WebSocket and manages WebSocket connections.
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

	// Send the initial value to the client
	initialValue := Message{Value: generateNewValue()}
	if err := conn.WriteJSON(initialValue); err != nil {
		log.Printf("Error sending initial value: %v", err)
		return
	}

	// Handle incoming messages
	for {
		if _, _, err := conn.ReadMessage(); err != nil {
			log.Printf("Error reading message: %v", err)
			if websocket.IsCloseError(err, websocket.CloseNormalClosure, websocket.CloseGoingAway) {
				log.Println("WebSocket connection closed.")
			}
			return
		}
	}
}

// generateNewValue generates a new value based on a cycling sequence.
func generateNewValue() int {
	// Lock the counter to prevent concurrent access
	counterMutex.Lock()
	defer counterMutex.Unlock()

	// Generate a new value by cycling through the values array
	value := cyclingValues[counter]
	counter = (counter + 1) % len(cyclingValues)

	fmt.Printf("Broadcasting new value: %d (counter: %d)\n", value, counter)

	return value
}

// Initialize the package by starting the broadcast goroutine
func init() {
	go broadcastMessages()
}

// broadcastMessages broadcasts new values to all clients every (n * seconds).
func broadcastMessages() {
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			// Generate a new value every (n * seconds)
			newValue := Message{Value: generateNewValue()}

			// Convert sync.Map to a regular map for iteration
			clients.Range(func(key, value interface{}) bool {
				conn := key.(*websocket.Conn)
				if err := conn.WriteJSON(newValue); err != nil {
					log.Printf("Error broadcasting: %v", err)
				}
				return true // continue iteration
			})

			log.Printf("Broadcasted message at: %v", time.Now())
		case <-done:
			// Exit the goroutine when done is closed
			return
		}
	}
}

// closeConnection closes a WebSocket connection and removes it from the clients map.
func closeConnection(conn *websocket.Conn) {
	conn.Close()
	clients.Delete(conn)
	log.Println("WebSocket connection closed.")
}
