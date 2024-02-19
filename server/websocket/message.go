// message.go
package websocket

import (
	"encoding/json"
	"log"
	"server/database"
	"server/types"
	"time"

	"github.com/gorilla/websocket"
)

func handleIncomingMessages(conn *websocket.Conn) {
	conn.SetPingHandler(func(appData string) error {
		var msg types.Message
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

	for {
		// Read in a new message as JSON and map it to a Message object
		var msg types.Message
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
			handleGetPlayerMap(conn, msg)
		}
	}
}

func getPlayerMap(playerId string, location types.Location) ([]types.Tile, error) {
	tiles, err := database.GetTilesInRange("gameGrid.db", location.X, location.Y, 3, 3)
	if err != nil {
		// handle the error, for example, return it to the caller
		return nil, err
	}
	return tiles, nil
}

func handleGetPlayerMap(conn *websocket.Conn, msg types.Message) {
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
	err = conn.WriteJSON(types.Response{
		Type:    "GetPlayerMap",
		Payload: tiles,
	})
	if err != nil {
		log.Printf("Error sending results: %v", err)
	}
}
