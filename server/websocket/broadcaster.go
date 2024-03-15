// broadcaster.go
package websocket

import (
	"encoding/json"
	"log"
	"server/types"

	"github.com/gorilla/websocket"
)

func BroadcastMessages() {
	for {
		message := <-broadcastChannel

		if message.Type == "SyncPlayers" {

			var payload types.SyncMessagePayload

			if err := json.Unmarshal(message.Payload, &payload); err != nil {
				log.Printf("Error decoding MoveMessage: %v", err)
				return
			}

			if conn, ok := connectedPlayers[payload.PlayerId]; ok {
				err := conn.WriteJSON(message)
				if err != nil {
					log.Println("Error broadcasting message:", err)
					// Handle disconnection or error (e.g., remove client from the clients map)
					delete(connectedPlayers, payload.PlayerId)
				}
			}

		} else {

			clients.Range(func(client, _ interface{}) bool {
				err := client.(*websocket.Conn).WriteJSON(message)
				if err != nil {
					log.Println("Error broadcasting message:", err)
					// Handle disconnection or error (e.g., remove client from the clients map)
					clients.Delete(client)
				}
				return true // continue iteration
			})
		}
	}
}

// func BroadcastMessages() {
// 	for {
// 		message := <-broadcastChannel

// 		if message.Type == "SyncPlayers" {

// 			var payload types.SyncMessagePayload

// 			if err := json.Unmarshal(message.Payload, &payload); err != nil {
// 				log.Printf("Error decoding MoveMessage: %v", err)
// 				return
// 			}

// 			if conn, ok := connectedPlayers[payload.PlayerId]; ok {
// 				err := conn.WriteJSON(message)
// 				if err != nil {
// 					log.Println("Error broadcasting message:", err)
// 					// Handle disconnection or error (e.g., remove client from the clients map)
// 					delete(connectedPlayers, payload.PlayerId)
// 				}
// 			}

// 		} else {

// 			clients.Range(func(client, _ interface{}) bool {
// 				err := client.(*websocket.Conn).WriteJSON(message)
// 				if err != nil {
// 					log.Println("Error broadcasting message:", err)
// 					// Handle disconnection or error (e.g., remove client from the clients map)
// 					clients.Delete(client)
// 				}
// 				return true // continue iteration
// 			})
// 		}
// 	}
// }
