// Package websocket provides a WebSocket server implementation.
package websocket

import (
	"encoding/json"
	"log"
	"net/http"
	"server/database"
	"server/types"
	"sync"
	"time"

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

	conn.SetPingHandler(func(appData string) error {
		var msg Message
		err := json.Unmarshal([]byte(appData), &msg)
		if err != nil {
			log.Printf("Error reading ping message: %v", err)
			return err
		}

		if msg.Type == "ping" {
			// Send a pong in response to the ping
			return conn.WriteControl(websocket.PongMessage, []byte{}, time.Now().Add(time.Second))
		}

		return nil
	})

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
