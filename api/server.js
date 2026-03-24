import express from "express";
import dotenv from "dotenv";
import { TwitterApi } from "twitter-api-v2";

dotenv.config();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// 🔥 ViralFlow Webhook → Twitter Post
app.post("/api/webhook", async (req, res) => {
  try {
    const post = req.body;

    console.log("📩 ViralFlow webhook:", post);

    const tweet =
      post?.content ||
      post?.text ||
      post?.tweet ||
      "Empty tweet";

    console.log("📝 Tweet received:", tweet);

    // 🚀 Twitter OAuth posting
    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET,
      accessToken: post.access_token,
      accessSecret: post.access_token_secret,
    });

    const twitter = client.readWrite;

    const result = await twitter.v2.tweet(tweet);

    console.log("🐦 Tweet posted:", result?.data?.id);

    res.json({
      success: true,
      tweet_id: result?.data?.id,
    });
  } catch (error) {
    console.error("❌ Tweet failed:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
