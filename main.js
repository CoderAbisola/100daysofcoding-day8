const form = document.getElementById("chatForm");
const input = document.getElementById("question");
const chatBox = document.getElementById("chatbox");

const OPENROUTER_API_KEY = "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";

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userMessage = input.value.trim();
  if (!userMessage) return;

  addMessage("You", userMessage);
  input.value = ""; 

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "X-Title": "MyAI"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-distill-qwen-32b:free",
        messages: [
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    const aiMessage = data.choices?.[0]?.message?.content;

    addMessage("AI", aiMessage || "Sorry, I didn’t understand that.");
  } catch (err) {
    console.error("Error talking to AI:", err);
    addMessage("AI", "Oops! Something went wrong.");
  }
});

function addMessage(sender, text) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message");
  messageDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}
