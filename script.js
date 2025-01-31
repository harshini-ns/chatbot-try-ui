document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.getElementById("toggleButton");
    const contentDiv = document.getElementById("content");
    const sendButton = document.getElementById("sendButton");
    const messagesDiv = document.getElementById("messages");
    const userInput = document.getElementById("userInput");

    toggleButton.addEventListener("click", function () {
        if (contentDiv.style.display === "none" || contentDiv.style.display === "") {
            contentDiv.style.display = "block";
            toggleButton.textContent = "Hide Content";
        } else {
            contentDiv.style.display = "none";
            toggleButton.textContent = "Show Content";
        }
    });

    sendButton.addEventListener("click", function () {
        const message = userInput.value.trim();
        if (message) {
            const userMessage = document.createElement("div");
            userMessage.classList.add("message", "user");
            userMessage.textContent = message;
            messagesDiv.appendChild(userMessage);
            userInput.value = "";
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
    });
});
