<template>
	<div>
		<button @click="incrementCounter">{{ count }}</button>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const SERVER_URL = "http://localhost:3001";
const WEBSOCKET_URL = "ws://localhost:3001";

const count = ref<number>(0);
let socket: WebSocket | null = null;

/**
 * Setup WebSocket connection to the server to periodically receive counter updates across all clients.
 */
const setupSocket = () => {
	socket = new WebSocket(WEBSOCKET_URL);

	// Handle incoming messages from the server.
	socket.onmessage = (event) => {
		const data = JSON.parse(event.data);
		// Update the counter value if the message contains a count.
		if (data && data.count !== undefined) {
			count.value = data.count;
		}
	};

	// Attempt to reconnect if the connection is closed.
	socket.onclose = () => {
		console.warn(
			"WebSocket connection closed, attempting to reconnect in 5 seconds..."
		);
		setTimeout(setupSocket, 5000); // Attempt to reconnect after 5 seconds.
	};

	// Handle WebSocket errors.
	socket.onerror = (error) => {
		console.error("WebSocket error:", error);
	};
};

/**
 * Increment the counter on the server.
 */
const incrementCounter = async () => {
	try {
		await fetch(`${SERVER_URL}/increment`, {
			method: "POST",
		});
	} catch (error) {
		console.error("Error incrementing counter:", error);
	}
};

// Setup WebSocket connection when the component is mounted.
onMounted(() => {
	setupSocket();
});

// Close the WebSocket connection when the component is unmounted.
onUnmounted(() => {
	socket?.close();
});
</script>

<style scoped>
button {
	font-size: 1.5rem;
	padding: 0.5rem 1rem;
	cursor: pointer;
}
</style>
