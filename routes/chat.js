//chat.js

document.addEventListener('DOMContentLoaded', function () {
    // Add event listener to send button
    document.getElementById('send-button').addEventListener('click', sendMessage);
});

async function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();
    if (message === '') return;

    // Clear input field
    messageInput.value = '';

    // Display sent message in chat area
    addMessageToChatArea(message, 'sent');

    try {
        // Send message to server
        const response = await fetch('/webhook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        if (!response.ok) {
            throw new Error('Failed to send message');
        }

        // Display server response in chat area
        const data = await response.json();
        addMessageToChatArea(data.message, 'received');
    } catch (error) {
        console.error('Error sending message:', error);
        addMessageToChatArea('Failed to send message', 'error');
    }
}

function addMessageToChatArea(message, type) {
    const chatArea = document.getElementById('chat-area');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.textContent = message;
    chatArea.appendChild(messageElement);
    chatArea.scrollTop = chatArea.scrollHeight;
}
