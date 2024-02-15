// Package websocket provides a WebSocket server implementation.
package websocket

import (
	"log"
	"net/http"
	"server/database"
	"server/types"
	"sync"

	"github.com/gorilla/websocket"
)

type Location struct {
	X, Y int
}

type PlayerLocationPayload struct {
	PlayerId string
	Location Location
}

type Message struct {
	Type    string
	Payload PlayerLocationPayload
}

type Response struct {
	Type    string
	Payload []types.Tile
}

// Global variables for broadcasting messages to all clients
var (
	broadcastChannel = make(chan Message, 500) // Channel for broadcasting messages to all clients
	clients          sync.Map                  // Concurrent map to store client connections
	upgrader         = websocket.Upgrader{     // Upgrader for upgrading HTTP connections to WebSocket
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
	for {
		// Read in a new message as JSON and map it to a Message object
		var msg Message
		err := conn.ReadJSON(&msg)
		if err != nil {
			log.Printf("Error reading message: %v", err)
			if websocket.IsCloseError(err, websocket.CloseNormalClosure, websocket.CloseGoingAway) {
				log.Println("WebSocket connection closed.")
			}
			return
		}

		// Check the message type
		if msg.Type == "GetPlayerMap" {
			// Extract playerId and location from the message
			playerId := msg.Payload.PlayerId
			location := msg.Payload.Location

			// Run your function with the playerId and location
			tiles, err := getPlayerMap(playerId, location)
			if err != nil {
				// Handle the error
				log.Printf("Error getting player map: %v", err)
				return
			}

			// Send the results back to the client
			err = conn.WriteJSON(Response{
				Type:    "GetPlayerMap",
				Payload: tiles,
			})
			if err != nil {
				log.Printf("Error sending results: %v", err)
				break
			}
		}
	}
}

func getPlayerMap(playerId string, location Location) ([]types.Tile, error) {
	tiles, err := database.GetTilesInRange("gameGrid.db", location.X, location.Y, 3, 3)
	if err != nil {
		// handle the error, for example, return it to the caller
		return nil, err
	}
	return tiles, nil
}

func closeConnection(conn *websocket.Conn) {
	conn.Close()
	clients.Delete(conn)
	log.Println("WebSocket connection closed.")
}

// import (
// 	"fmt"
// 	"log"
// 	"net/http"
// 	"sync"
// 	"time"

// 	"github.com/gorilla/websocket"
// )

// // Message represents the structure of the messages sent over the WebSocket.
// type Message struct {
// 	Value int `json:"value"`
// }

// // HandleWebSocketConnection upgrades HTTP connections to WebSocket and manages WebSocket connections.
// func HandleWebSocketConnection(w http.ResponseWriter, r *http.Request) {
// 	// Upgrade the HTTP connection to a WebSocket connection
// 	conn, err := upgrader.Upgrade(w, r, nil)
// 	if err != nil {
// 		log.Printf("Error upgrading to WebSocket: %v", err)
// 		return
// 	}
// 	// Ensure the connection is closed when the function returns
// 	defer closeConnection(conn)

// 	// Store the connection in the clients map
// 	clients.Store(conn, true)

// 	// Send the initial value to the client
// 	initialValue := Message{Value: generateNewValue()}
// 	if err := conn.WriteJSON(initialValue); err != nil {
// 		log.Printf("Error sending initial value: %v", err)
// 		return
// 	}

// 	// Handle incoming messages
// 	for {
// 		if _, _, err := conn.ReadMessage(); err != nil {
// 			log.Printf("Error reading message: %v", err)
// 			if websocket.IsCloseError(err, websocket.CloseNormalClosure, websocket.CloseGoingAway) {
// 				log.Println("WebSocket connection closed.")
// 			}
// 			return
// 		}
// 	}
// }

// // generateNewValue generates a new value based on a cycling sequence.
// func generateNewValue() int {
// 	// Lock the counter to prevent concurrent access
// 	counterMutex.Lock()
// 	defer counterMutex.Unlock()

// 	// Generate a new value by cycling through the values array
// 	value := cyclingValues[counter]
// 	counter = (counter + 1) % len(cyclingValues)

// 	fmt.Printf("Broadcasting new value: %d (counter: %d)\n", value, counter)

// 	return value
// }

// // Initialize the package by starting the broadcast goroutine
// func init() {
// 	go broadcastMessages()
// }

// // broadcastMessages broadcasts new values to all clients every (n * seconds).
// func broadcastMessages() {
// 	defer ticker.Stop()

// 	for {
// 		select {
// 		case <-ticker.C:
// 			// Generate a new value every (n * seconds)
// 			newValue := Message{Value: generateNewValue()}

// 			// Convert sync.Map to a regular map for iteration
// 			clients.Range(func(key, value interface{}) bool {
// 				conn := key.(*websocket.Conn)
// 				if err := conn.WriteJSON(newValue); err != nil {
// 					log.Printf("Error broadcasting: %v", err)
// 				}
// 				return true // continue iteration
// 			})

// 			log.Printf("Broadcasted message at: %v", time.Now())
// 		case <-done:
// 			// Exit the goroutine when done is closed
// 			return
// 		}
// 	}

// }

// // closeConnection closes a WebSocket connection and removes it from the clients map.
// func closeConnection(conn *websocket.Conn) {
// 	conn.Close()
// 	clients.Delete(conn)
// 	log.Println("WebSocket connection closed.")
// }
