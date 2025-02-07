document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.getElementById("toggleButton");
    const contentDiv = document.getElementById("content");
    const sendButton = document.getElementById("sendButton");
    const messagesDiv = document.getElementById("messages");
    const userInput = document.getElementById("userInput");

    let sessionId = null;

    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    async function createSession() {
        try {
            const userId = generateUUID();
            const response = await fetch("http://localhost:8080/session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: userId })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error: ${response.status}, Message: ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();
            sessionId = data.session_id;
            console.log("Session Created:", sessionId);
            return sessionId;
        } catch (error) {
            console.error("Failed to create session:", error);
            throw error;
        }
    }

    function isValidUUID(uuid) {
        const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return regex.test(uuid);
    }

    async function sendMessageToAI(message) {
        try {
            if (!sessionId) {
                sessionId = await createSession();
            }

            if (!isValidUUID(sessionId)) {
                throw new Error("Invalid session ID format");
            }

            const requestBody = JSON.stringify({
                session_id: sessionId,
                message: message,
            });

            console.log("Sending request:", requestBody);

            const response = await fetch("http://localhost:8080/openai/chat/complete/simple", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: requestBody,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error: ${response.status}, Message: ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();
            console.log("Full API response:", data);
            return data.message || "No response from AI";

        } catch (error) {
            console.error("Failed to connect to OpenAI:", error);
            return "Error: Unable to fetch response.";
        }
    }

    toggleButton.addEventListener("click", function () {
        if (contentDiv.style.display === "none" || contentDiv.style.display === "") {
            contentDiv.style.display = "block";
            toggleButton.textContent = "Hide Chatbot";
        } else {
            contentDiv.style.display = "none";
            toggleButton.textContent = "Show Chatbot";
        }
    });

    sendButton.addEventListener("click", async function () {
        const message = userInput.value.trim();
        if (message) {
            appendMessage(message, 'user');
            userInput.value = "";

            const aiResponse = await sendMessageToAI(message);
            console.log("Received AI response:", aiResponse);

            if (aiResponse && aiResponse !== "undefined") {
                appendMessage(aiResponse, 'bot');
            } else {
                appendMessage("Sorry, I couldn't generate a response.", 'bot');
            }
        }
    });

    function appendMessage(text, sender) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", sender);
        messageDiv.textContent = text;
        messagesDiv.appendChild(messageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        console.log(`Appended ${sender} message:`, text);
    }
});
