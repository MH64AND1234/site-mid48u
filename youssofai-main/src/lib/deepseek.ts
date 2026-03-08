const API_URL = "https://darkaiwormgptvercel.vercel.app/api/sendError";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function sendMessage(text: string): Promise<string> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return data.response || JSON.stringify(data);
}
