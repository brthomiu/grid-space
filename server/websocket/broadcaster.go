// broadcaster.go
package websocket

import (
	"log"

	"github.com/gorilla/websocket"
)

func BroadcastMessages() {
	for {
		message := <-broadcastChannel
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
