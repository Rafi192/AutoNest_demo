
const API_URL = "http://127.0.0.1:8000";

const chatWindow = document.getElementById("chatWindow");
const chatFab = document.getElementById("chatFab");
const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const sendButton = document.getElementById("sendButton");
const suggestions = document.getElementById("suggestions");

function openChat() {
  chatWindow.classList.add("open");
  chatFab.style.display = "none";
  setTimeout(() => chatInput.focus(), 100);
}

function closeChat() {
  chatWindow.classList.remove("open");
  chatFab.style.display = "flex";
}

function useSuggestion(text) {
  chatInput.value = text;
  sendMessage();
}

function addMessage(text, role, sources = []) {
  const wrapper = document.createElement("div");

  const message = document.createElement("div");
  message.className = `message ${role}`;
  message.textContent = text;
  wrapper.appendChild(message);

  if (role === "assistant" && sources.length) {
    const sourceBox = document.createElement("div");
    sourceBox.className = "source-box";

    const title = document.createElement("div");
    title.className = "source-title";
    title.textContent = "📄 Knowledge base source";
    sourceBox.appendChild(title);

    const items = document.createElement("div");
    items.className = "source-items";

    sources.forEach((source) => {
      const tag = document.createElement("span");
      tag.textContent = source;
      items.appendChild(tag);
    });

    sourceBox.appendChild(items);
    wrapper.appendChild(sourceBox);
  }

  chatMessages.appendChild(wrapper);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTyping() {
  const typing = document.createElement("div");
  typing.id = "typing";
  typing.className = "message assistant typing";
  typing.innerHTML = "<span></span><span></span><span></span>";
  chatMessages.appendChild(typing);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTyping() {
  document.getElementById("typing")?.remove();
}

async function sendMessage(event) {
  if (event) event.preventDefault();

  const message = chatInput.value.trim();
  if (!message || sendButton.disabled) return;

  suggestions.style.display = "none";
  chatInput.value = "";
  addMessage(message, "user");

  sendButton.disabled = true;
  chatInput.disabled = true;
  showTyping();

  try {
    const response = await fetch(`${API_URL.replace(/\/$/, "")}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    removeTyping();
    addMessage(
  data.answer || "Sorry, I couldn't find an answer to that.",
  "assistant"
);
  } catch (error) {
    console.error("AutoNest API error:", error);
    removeTyping();

    addMessage(
      "Sorry, I couldn't connect to the AutoNest AI server. Please check that the FastAPI backend is running and CORS is configured.",
      "assistant"
    );
  } finally {
    sendButton.disabled = false;
    chatInput.disabled = false;
    chatInput.focus();
  }
}