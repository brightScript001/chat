document.getElementById('send-button').addEventListener('click', async () => {
    console.log('Send button clicked'); // Debugging statement
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();
    if (message === '') return;

    messageInput.value = '';
    addMessageToChatArea(message, 'sent');

    try {
        const response = await fetch('/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        if (!response.ok) {
            throw new Error('Failed to send message');
        }

        const data = await response.json();
        addMessageToChatArea(data.message, 'received');
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
