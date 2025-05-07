const form = document.getElementById("chatForm");
const input = document.getElementById("question");
const chatBox = document.getElementById("chatbox");

const OPENROUTER_API_KEY = "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"; 

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userMessage = input.value.trim();
  if (!userMessage) return;

  addMessage("You", userMessage, "user");
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
          {
            role: "system",
            content: "Format your responses using HTML. Use <p> for paragraphs and <strong> for bold titles or section names."
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();
    const aiMessage = data.choices?.[0]?.message?.content;

    addMessage("AI", aiMessage || "Sorry, I didn’t understand that.", "bot");
  } catch (err) {
    console.error("Error talking to AI:", err);
    addMessage("AI", "Oops! Something went wrong.", "bot");
  }
});

function addMessage(sender, text, type) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", type);
  messageDiv.innerHTML = `<strong>${sender}:</strong><br>${text}`;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}
