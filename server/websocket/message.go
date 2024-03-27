// message.go
package websocket

import (
	"encoding/json"
	"log"
	"server/database"
	"server/types"

	"github.com/gorilla/websocket"
)

// Create a buffered channel to store incoming requests
var requests = make(chan types.Message, 50)

// Function to handle incoming messages from clients
func processMessage(conn *websocket.Conn, msg types.Message) {
	// Process the message
	switch msg.Type {
	// Handle player movement message
	case "MoveMessage":
		var payload types.MoveMessage
		if err := json.Unmarshal(msg.Payload, &payload); err != nil {
			log.Printf("Error decoding MoveMessage: %v", err)
			return
		}

		// Use mutex to safely access connectedPlayers
		mutex.Lock()
		recipientConn := connectedPlayers[payload.Id]
		mutex.Unlock()

		// Pass the recipient's connection to the handler function
		handleMovePlayer(recipientConn, payload)

		// Handle character creation - being deprecated and moved to a REST API
	case "CharacterCreationMessage":
		var payload types.CharacterCreationMessagePayload
		if err := json.Unmarshal(msg.Payload, &payload); err != nil {
			log.Printf("Error decoding MoveMessage: %v", err)
			return
		}

		// Use mutex to safely access connectedPlayers
		mutex.Lock()
		recipientConn := connectedPlayers[payload.Id]
		mutex.Unlock()

		if recipientConn != nil {
			conn = recipientConn
		}

		// Get the response message
		response, err := handleCharacterCreation(conn, payload, connectedPlayers, payload.Id)
		if err != nil {
			log.Printf("Error handling character creation: %v", err)
			return
		}

		// Iterate over all connected players and send the response to each one
		for _, recipientConn := range connectedPlayers {
			// Send the response to the intended recipient
			err := recipientConn.WriteJSON(response)
			if err != nil {
				log.Printf("Error sending results to %v: %v", recipientConn.RemoteAddr(), err)
			}
		}

		// // Get the connection for the intended recipient
		// recipientConn := connectedPlayers[response.Payload.CharacterObject.Id]
		// log.Printf("Recipient connection: %v", recipientConn.RemoteAddr())

		// // Send the response to the intended recipient
		// err = recipientConn.WriteJSON(response)
		// if err != nil {
		// 	log.Printf("Error sending results: %v", err)
		// }

	case "ping": // Empty case to ignore ping messages

	// Log unknown messages
	default:
		log.Printf("Unknown message type: %v", msg.Type)
	}
}

// Handler function to sync players with database
func handleSyncPlayers(connectedPlayers map[string]*websocket.Conn) {
	database.SyncPlayers(connectedPlayers)
}

// Function to handle player movement
func handleMovePlayer(_ *websocket.Conn, msg types.MoveMessage) {
	// Extract player Id and new location from the message
	Id := msg.Id
	Direction := msg.Direction

	// Lookup current player location
	NextLocation, err := database.GetPlayerLocation("gameGrid.db", Id)
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

	// Run UpdatePlayerLocation with the playerId and location
	err = database.UpdatePlayerLocation("gameGrid.db", Id, NextLocation)
	if err != nil {
		// Handle the error
		log.Printf("Error moving player: %v", err)
		return
	}

}

func handleCharacterCreation(conn *websocket.Conn, msg types.CharacterCreationMessagePayload, connectedPlayers map[string]*websocket.Conn, Id string) (types.CharacterCreationResponse, error) {
	// Extract player Id and new location from the message
	Name := msg.Name

	// Run CreateCharacter with the playerId and location
	newCharacterObject, err := database.CreateCharacter("gameGrid.db", Id, Name)
	if err != nil {
		// Handle the error
		log.Printf("Error creating character: %v", err)
	}

	PlayerID := newCharacterObject.UnitObj.Id

	log.Printf("PlayerID: %s, conn: %p", PlayerID, conn)

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

	// Create the response message
	response := types.CharacterCreationResponse{
		Type:    "CharacterCreationResponse",
		Payload: payload,
	}

	log.Printf("creation response payload Id----- %v", payload.CharacterObject.Id)

	// Return the response message
	return response, nil
}
