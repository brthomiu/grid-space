// websocket/broadcaster.go
package websocket

import "log"

func BroadcastMessages() {
	for {
		message := <-broadcastChannel
		for client := range clients {
			err := client.WriteJSON(message)
			if err != nil {
				log.Println("Error broadcasting message:", err)
				// Handle disconnection or error (e.g., remove client from the clients map)
			}
		}
	}
}
