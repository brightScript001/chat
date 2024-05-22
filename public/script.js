document.getElementById('send-button').addEventListener('click', async () => {
    console.log('Send button clicked'); // Debugging statement
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();
    if (message === '') {
        console.log('Empty message'); // Debugging statement
        return;
    }

    messageInput.value = '';
    addMessageToChatArea(message, 'sent');

    try {
        console.log('Sending message:', message); // Debugging statement
        const response = await fetch('/webhook', { // Updated endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        console.log('Response status:', response.status); // Debugging statement

        if (!response.ok) {
            console.error('Error sending message:', await response.text());
            addMessageToChatArea('Failed to send message', 'error');
            throw new Error('Failed to send message');
        }

        const data = await response.json();
        console.log('Response data:', data); // Debugging statement

        // Delay the response by 1 second
        setTimeout(() => {
            addMessageToChatArea(data.message, 'received');
        }, 1000);
    } catch (error) {
        console.error('Error sending message:', error);
        addMessageToChatArea('Failed to send message', 'error');
    }
});

function addMessageToChatArea(message, type) {
    const chatArea = document.getElementById('chat-area');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.textContent = message;
    chatArea.appendChild(messageElement);
    chatArea.scrollTop = chatArea.scrollHeight;
}
