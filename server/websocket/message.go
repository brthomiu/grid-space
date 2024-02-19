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
		// Send a pong in response to the ping
		return conn.WriteControl(websocket.PongMessage, []byte{}, time.Now().Add(time.Second))
	})

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

		switch msg.Type {
		case "GetPlayerMap":
			var payload types.GetPlayerMapMessage
			if err := json.Unmarshal(msg.Payload, &payload); err != nil {
				log.Printf("Error decoding GetPlayerMapMessage: %v", err)
				return
			}
			handleGetPlayerMap(conn, payload)
		case "MoveMessage":
			var payload types.MoveMessage
			if err := json.Unmarshal(msg.Payload, &payload); err != nil {
				log.Printf("Error decoding MoveMessage: %v", err)
				return
			}
			handleMovePlayer(conn, payload)
		case "ping":
		default:
			log.Printf("Unknown message type: %v", msg.Type)
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

func handleGetPlayerMap(conn *websocket.Conn, msg types.GetPlayerMapMessage) {
	// Extract playerId and location from the message
	playerId := msg.PlayerId
	location := msg.Location

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

func movePlayer(Id string, nextLocation types.Location) ([]types.Tile, error) {
	tiles, err := database.GetTilesInRange("gameGrid.db", nextLocation.X, nextLocation.Y, 3, 3)
	if err != nil {
		// handle the error, for example, return it to the caller
		return nil, err
	}
	return tiles, nil
}

func handleMovePlayer(conn *websocket.Conn, msg types.MoveMessage) {
	// Extract player Id and new location from the message
	Id := msg.Id
	NextLocation := msg.NextLocation

	// Run your function with the playerId and location
	tiles, err := movePlayer(Id, NextLocation)
	if err != nil {
		// Handle the error
		log.Printf("Error moving player: %v", err)
		return
	}

	// Send the results back to the client
	err = conn.WriteJSON(types.Response{
		Type:    "MovePlayer",
		Payload: tiles,
	})
	if err != nil {
		log.Printf("Error sending results: %v", err)
	}
}
