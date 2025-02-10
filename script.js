const chatContainer = document.getElementById("chat-container");
const chatInput = document.getElementById("chat-input");
const sendButton = document.getElementById("send-btn");
const deleteButton = document.getElementById("delete-btn");
const themeButton = document.getElementById("theme-btn");

let userText = null;
const API_KEY = "YOUR_OPENAI_API_KEY"; // Replace with your OpenAI API key

// Function to create a chat element
const createChatElement = (html, className) => {
  const chatDiv = document.createElement("div");
  chatDiv.classList.add("chat-content", className);
  chatDiv.innerHTML = html;
  return chatDiv;
};

// Function to show typing animation
const showTypingAnimation = () => {
  const html = `<div class="chat-details">
                  <img src="images/chatbot.jpg" alt="bot-img">
                  <div class="typing-animation">
                    <div class="typing-dot" style="--delay: 0s"></div>
                    <div class="typing-dot" style="--delay: 0.2s"></div>
                    <div class="typing-dot" style="--delay: 0.4s"></div>
                  </div>
                </div>`;
  const incomingChatDiv = createChatElement(html, "incoming");
  chatContainer.appendChild(incomingChatDiv);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
  getChatResponse(incomingChatDiv);
};

// Function to handle outgoing chat
const handleOutgoingChat = () => {
  userText = chatInput.value.trim();
  if (!userText) return;

  chatInput.value = "";
  chatInput.style.height = `${initialInputHeight}px`;

  const html = `<div class="chat-details">
                  <img src="images/user.jpg" alt="user-img">
                  <p>${userText}</p>
                </div>`;
  const outgoingChatDiv = createChatElement(html, "outgoing");
  chatContainer.querySelector(".default-text")?.remove();
  chatContainer.appendChild(outgoingChatDiv);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
  setTimeout(showTypingAnimation, 500);
};

// Function to get real ChatGPT response
const getChatResponse = async (incomingChatDiv) => {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // Use the ChatGPT model
        messages: [{ role: "user", content: userText }],
      }),
    });

    const data = await response.json();
    const botResponse = data.choices[0].message.content;

    const html = `<div class="chat-details">
                    <img src="images/bot.jpg" alt="bot-img">
                    <p>${botResponse}</p>
                  </div>`;
    incomingChatDiv.innerHTML = html;
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
  } catch (error) {
    console.error("Error fetching ChatGPT response:", error);
    const html = `<div class="chat-details">
                    <img src="images/bot.jpg" alt="bot-img">
                    <p>Sorry, something went wrong. Please try again.</p>
                  </div>`;
    incomingChatDiv.innerHTML = html;
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
  }
};

// Event listeners
deleteButton.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all the chats?")) {
    localStorage.removeItem("all-chats");
    loadDataFromLocalstorage();
  }
});

themeButton.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  localStorage.setItem("themeColor", themeButton.innerText);
  themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";
});

const initialInputHeight = chatInput.scrollHeight;

chatInput.addEventListener("input", () => {
  chatInput.style.height = `${initialInputHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault();
    handleOutgoingChat();
  }
});

sendButton.addEventListener("click", handleOutgoingChat);

// Load data from local storage
const loadDataFromLocalstorage = () => {
  const themeColor = localStorage.getItem("themeColor");
  if (themeColor === "dark_mode") {
    document.body.classList.add("light-mode");
    themeButton.innerText = "dark_mode";
  } else {
    document.body.classList.remove("light-mode");
    themeButton.innerText = "light_mode";
  }
};

loadDataFromLocalstorage();

