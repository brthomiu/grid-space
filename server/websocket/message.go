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

// Create a buffered channel to store incoming requests
var requests = make(chan types.Message, 10)

func handleIncomingMessages(conn *websocket.Conn) {
	conn.SetPingHandler(func(appData string) error {
		// Send a pong in response to the ping
		return conn.WriteControl(websocket.PongMessage, []byte{}, time.Now().Add(time.Second))
	})

	// Create a ticker that fires every second (or whatever your desired tickrate is)
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
				handleSyncPlayers(connectedPlayers)
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

func processMessage(conn *websocket.Conn, msg types.Message) {
	// Process the message (i.e., the existing code in your switch statement)
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
		handleCharacterCreation(conn, payload, connectedPlayers)

	case "ping": // Ignore ping messages
	default:
		log.Printf("Unknown message type: %v", msg.Type)
	}
}

func handleSyncPlayers(connectedPlayers map[string]*websocket.Conn) {
	database.SyncPlayers(connectedPlayers, mutex)
}

func handleMovePlayer(conn *websocket.Conn, msg types.MoveMessage) {
	// Extract player Id and new location from the message
	Id := msg.Id
	Direction := msg.Direction

	// Validate movement direction

	// Lookup current player location

	NextLocation, err := database.GetPlayerLocation("gameGrid.db", Id)
	log.Println(Id, NextLocation)
	if err != nil {
		// Handle the error
		log.Println("Error moving player: could not lookup current player location", err)
		return
	}

	// Update Location based on Direction

	switch Direction {
	case "up":
		// Update NextLocation based on the "up" direction
		NextLocation.X--
	case "down":
		// Update NextLocation based on the "down" direction
		NextLocation.X++
	case "left":
		// Update NextLocation based on the "left" direction
		NextLocation.Y--
	case "right":
		// Update NextLocation based on the "right" direction
		NextLocation.Y++
	default:
		// Handle the default case if Direction is none of the specified values
		log.Println("Invalid direction")
	}

	// Run your function with the playerId and location
	err = database.UpdatePlayerLocation("gameGrid.db", Id, NextLocation)
	log.Println(Id, NextLocation)
	if err != nil {
		// Handle the error
		log.Printf("Error moving player: %v", err)
		return
	}

}

func handleCharacterCreation(conn *websocket.Conn, msg types.CharacterCreationMessagePayload, connectedPlayers map[string]*websocket.Conn) {
	// Extract player Id and new location from the message
	Name := msg.Name

	log.Println("Name message", msg)

	log.Println("Name from message for character", Name)

	// Run your function with the playerId and location
	newCharacterObject, err := database.CreateCharacter("gameGrid.db", Name)
	if err != nil {
		// Handle the error
		log.Printf("Error creating character: %v", err)
		return
	}

	PlayerID := newCharacterObject.UnitObj.Id

	// Store the connection and player's ID in the connectedPlayers map
	mutex.Lock()
	connectedPlayers[PlayerID] = conn
	mutex.Unlock()
	log.Println("connected", connectedPlayers)

	// Create the response payload
	payload := types.CharacterCreationResponsePayload{
		CharacterObject: newCharacterObject.UnitObj,
		Location:        newCharacterObject.Location,
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
