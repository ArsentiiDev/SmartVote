export const sendContactForm = async () =>
  fetch("/api/contact", {
    method: "POST",
    body: JSON.stringify({name:'tolik'}),
    headers: { "Content-Type": "application/json", Accept: "application/json" },
  }).then((res) => {
    if (!res.ok) throw new Error("Failed to send message");
    return res.json();
  });