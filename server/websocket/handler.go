// websocket/handler.go
package websocket

import (
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

var broadcastChannel = make(chan Message, 500)
var clients = make(map[*websocket.Conn]bool)
var clientsMutex sync.Mutex

// Message represents the structure of messages sent over WebSocket
type Message struct {
	Value int `json:"value"`
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

// HandleWebSocketConnection handles WebSocket connections
func HandleWebSocketConnection(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("Error upgrading to WebSocket: %v", err)
		return
	}
	defer func() {
		conn.Close()
		clientsMutex.Lock()
		delete(clients, conn)
		clientsMutex.Unlock()
		log.Println("WebSocket connection closed.")
	}()

	// Register the client
	clientsMutex.Lock()
	clients[conn] = true
	clientsMutex.Unlock()

	// Send initial value when a new client connects
	initialValue := Message{Value: generateNewValue()} // Use the initial cycling value
	err = conn.WriteJSON(initialValue)
	if err != nil {
		log.Printf("Error sending initial value: %v", err)
		return
	}

	// Explicitly declare the type of stopChan
	var stopChan = make(chan struct{})
	defer func() {
		close(stopChan)
		conn.Close()
		clientsMutex.Lock()
		delete(clients, conn)
		clientsMutex.Unlock()
		log.Println("WebSocket connection closed.")
	}()

	// Periodically change the value and broadcast to all clients
	go func(stopChan <-chan struct{}) {
		ticker := time.NewTicker(1 * time.Second) // Change value every 1 second, adjust as needed
		defer ticker.Stop()

		for {
			select {
			case <-ticker.C:
				newValue := generateNewValue()
				broadcastChannel <- Message{Value: newValue}

				// Use conn.WriteJSON to ensure proper JSON encoding
				err := conn.WriteJSON(Message{Value: newValue})
				if err != nil {
					log.Printf("Error broadcasting: %v", err)
					return
				}

				// Log the timestamp when a message is broadcasted
				log.Printf("Broadcasted message at: %v", time.Now())

			case <-stopChan:
				return // Stop the loop when signaled
			}
		}
	}(stopChan)

	// Handle the WebSocket connection
	for {
		messageType, _, err := conn.ReadMessage()
		if err != nil {
			log.Printf("Error reading message: %v", err)
			log.Println(messageType)
			// If the error indicates a closed connection, log it
			if websocket.IsCloseError(err, websocket.CloseNormalClosure, websocket.CloseGoingAway) {
				log.Println("WebSocket connection closed.")
			}

			return
		}
	}
}

var cyclingValues = []int{10, 20, 30, 40}
var counter int
var counterMutex sync.Mutex

func generateNewValue() int {
	counterMutex.Lock()
	defer counterMutex.Unlock()

	value := cyclingValues[counter]
	counter = (counter + 1) % len(cyclingValues)

	// Print cycling information for debugging
	fmt.Printf("Broadcasting new value: %d (counter: %d)\n", value, counter)

	return value
}
