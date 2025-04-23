document.addEventListener("DOMContentLoaded", () => {
  const chatbotButton = document.getElementById("chatbot-button");
  const chatbotContainer = document.getElementById("chatbot-container");
  const userInput = document.getElementById("user-input");
  const chatForm = document.getElementById("chat-form");
  const chatMessages = document.getElementById("chat-messages");

  const getTimestamp = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const createTimestampSpan = () => {
    const span = document.createElement("span");
    span.textContent = ` (${getTimestamp()})`;
    span.style.color = "#aaa";
    span.style.fontSize = "0.85em";
    return span;
  };

  const createSuggestions = () => {
    const suggestions = ["Opening Hours", "Contact", "Location"];
    const wrapper = document.createElement("div");
    wrapper.style.marginTop = "10px";
    wrapper.style.display = "flex";
    wrapper.style.flexWrap = "wrap";
    wrapper.style.gap = "8px";

    suggestions.forEach((text) => {
      const button = document.createElement("button");
      button.textContent = text;
      button.style.padding = "6px 10px";
      button.style.border = "1px solid #ccc";
      button.style.borderRadius = "15px";
      button.style.background = "#f2f2f2";
      button.style.cursor = "pointer";
      button.style.fontSize = "0.85em";
      button.style.transition = "background 0.2s";
      button.onmouseenter = () => (button.style.background = "#e6e6e6");
      button.onmouseleave = () => (button.style.background = "#f2f2f2");

      button.addEventListener("click", () => {
        userInput.value = text;
        chatForm.dispatchEvent(new Event("submit"));
      });

      wrapper.appendChild(button);
    });

    chatMessages.appendChild(wrapper);
  };

  // Typing animation div creator
  const createTypingIndicator = (showLabel = false) => {
    const typingDiv = document.createElement("div");
    typingDiv.className = "typing-indicator";
    typingDiv.innerHTML = showLabel
      ? `<span style="font-size: 0.95em;">🤖 <em>Martin is typing</em></span> <span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>`
      : `<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>`;
    typingDiv.style.color = "#888";
    typingDiv.style.fontSize = "1.0em";
    typingDiv.style.marginTop = "10px";
    return typingDiv;
  };

  // Toggle chatbot visibility
  chatbotButton.addEventListener("click", () => {
    chatbotContainer.classList.toggle("hidden");
    if (!chatbotContainer.classList.contains("hidden")) {
      userInput.focus();

      if (chatMessages.childElementCount === 0) {
        const typingDiv = createTypingIndicator(true);
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        setTimeout(() => {
          chatMessages.removeChild(typingDiv);
          const welcomeDiv = document.createElement("div");
          welcomeDiv.innerHTML =
            "🤖 <strong>Martin:</strong> Hi there, welcome to (company name). Please select one of the options below... we would love to help you.";
          welcomeDiv.appendChild(createTimestampSpan());
          welcomeDiv.style.textAlign = "left";
          welcomeDiv.style.marginTop = "10px";
          chatMessages.appendChild(welcomeDiv);
          chatMessages.scrollTop = chatMessages.scrollHeight;

          createSuggestions();
        }, 3000);
      }
    }
  });

  // Handle chat form submission
  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const message = userInput.value.trim();
    if (!message) return;

    const userDiv = document.createElement("div");
    userDiv.innerHTML = `🧍‍♂️ <strong>You:</strong> ${message}`;
    userDiv.appendChild(createTimestampSpan());
    userDiv.style.textAlign = "left";
    userDiv.style.marginTop = "15px";
    chatMessages.appendChild(userDiv);

    userInput.value = "";
    chatMessages.scrollTop = chatMessages.scrollHeight;

    const typingDiv = createTypingIndicator(true);
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
      const response = await fetch(`/get?msg=${encodeURIComponent(message)}`);
      const botReply = await response.json();

      setTimeout(() => {
        chatMessages.removeChild(typingDiv);

        const botDiv = document.createElement("div");
        botDiv.innerHTML = `🤖 <strong>Martin:</strong> ${botReply}`;
        botDiv.appendChild(createTimestampSpan());
        botDiv.style.textAlign = "left";
        botDiv.style.marginTop = "15px";
        chatMessages.appendChild(botDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }, 3000); // Delay to simulate typing

    } catch (error) {
      chatMessages.removeChild(typingDiv);
      const errorDiv = document.createElement("div");
      errorDiv.textContent = "🤖 Martin: Oops, something went wrong!";
      errorDiv.appendChild(createTimestampSpan());
      errorDiv.style.textAlign = "left";
      errorDiv.style.marginTop = "15px";
      chatMessages.appendChild(errorDiv);
    }
  });
});












