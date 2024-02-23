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
		case "MoveMessage":
			var payload types.MoveMessage
			if err := json.Unmarshal(msg.Payload, &payload); err != nil {
				log.Printf("Error decoding MoveMessage: %v", err)
				return
			}
			handleMovePlayer(conn, payload)

		case "CharacterCreationMessage":
			log.Println("payload from message------", msg.Payload)
			var payload types.CharacterCreationMessagePayload
			if err := json.Unmarshal(msg.Payload, &payload); err != nil {
				log.Printf("Error decoding MoveMessage: %v", err)
				return
			}
			handleCharacterCreation(conn, payload)

		case "ping": // Ignore ping messages
		default:
			log.Printf("Unknown message type: %v", msg.Type)
		}
	}

}

func handleMovePlayer(conn *websocket.Conn, msg types.MoveMessage) {
	// Extract player Id and new location from the message
	Id := msg.Id
	NextLocation := msg.NextLocation

	// Run your function with the playerId and location
	err := database.UpdatePlayerLocation("gameGrid.db", Id, NextLocation)
	log.Println(Id, NextLocation)
	if err != nil {
		// Handle the error
		log.Printf("Error moving player: %v", err)
		return
	}

	// Get all tiles within a 5x5 range of the new location
	tiles, err := database.GetTilesInRange("gameGrid.db", NextLocation.X, NextLocation.Y, 5, 5)
	if err != nil {
		// Handle the error
		log.Printf("Error getting tiles in range: %v", err)
		return
	}

	// Create the response payload
	payload := types.MoveMessagePayload{
		Tiles:        tiles,
		NextLocation: NextLocation,
	}

	// Send the response back to the client
	err = conn.WriteJSON(types.MoveMessageResponse{
		Type:    "MovePlayer",
		Payload: payload,
	})
	if err != nil {
		log.Printf("Error sending results: %v", err)
	}
}

func handleCharacterCreation(conn *websocket.Conn, msg types.CharacterCreationMessagePayload) {
	// Extract player Id and new location from the message
	Name := msg.Name

	log.Println("Name message", msg)

	log.Println("Name from message for character", Name)

	// Run your function with the playerId and location
	characterObject, err := database.CreateCharacter("gameGrid.db", Name)
	if err != nil {
		// Handle the error
		log.Printf("Error creating character: %v", err)
		return
	}

	// Create the response payload
	payload := types.CharacterCreationResponsePayload{
		CharacterObject: *characterObject,
	}

	// Send the response back to the client
	err = conn.WriteJSON(types.CharacterCreationResponse{
		Type:    "CharacterCreationResponse",
		Payload: payload,
	})
	if err != nil {
		log.Printf("Error sending results: %v", err)
	}

}
