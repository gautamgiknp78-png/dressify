import { useState } from "react";
import axios from "axios";

export default function AI() {
  const [image, setImage] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    // Bug fix: validate inputs before sending
    if (!image) {
      setError("Please select an image first.");
      return;
    }
    if (!prompt.trim()) {
      setError("Please enter an outfit prompt.");
      return;
    }

    setError("");
    setLoading(true);
    setResult("");

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("prompt", prompt);

      const res = await axios.post("http://localhost:5000/ai", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data.image);
    } catch (err) {
      // Bug fix: show error to user instead of silently failing
      setError("AI generation failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>AI Outfit Assistant</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 400 }}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <input
          placeholder="Enter outfit prompt (e.g. casual summer look)"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{ padding: 8, fontSize: 14 }}
        />
        <button
          onClick={handleUpload}
          disabled={loading}
          style={{ padding: "10px 20px", cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? "Generating..." : "Generate"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {result && (
          <img
            src={result}
            alt="AI Generated Outfit"
            style={{ marginTop: 20, width: 300, borderRadius: 8 }}
          />
        )}
      </div>
    </div>
  );
}
