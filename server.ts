import express, { Request, Response, NextFunction } from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import multer from "multer";
import path from "path";
import fs from "fs";
import ejs from "ejs";
import { db, Post, User } from "./src/data";

const app = express();
const PORT = 3000;

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || ".jpg";
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "social-network-secret-key-2026",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }, // 7 days
  })
);

// Static files
app.use("/static", express.static(path.join(process.cwd(), "public", "static")));
app.use("/uploads", express.static(uploadDir));

// Auth & Flash middleware
declare module "express-session" {
  interface SessionData {
    userId?: number;
    messages?: Array<{ type: "success" | "error"; text: string }>;
  }
}

app.use((req: Request, res: Response, next: NextFunction) => {
  // Default to logged-in user 1 (hussein) if no session exists yet for a smooth initial experience
  if (req.session.userId === undefined) {
    req.session.userId = 1;
  }

  const currentUser = req.session.userId ? db.getUserById(req.session.userId) : null;
  res.locals.user = currentUser;
  res.locals.unread_notifications_count = currentUser ? db.getUnreadNotificationCount(currentUser.id) : 0;
  res.locals.messages = req.session.messages || [];
  req.session.messages = []; // Clear flash messages
  next();
});

// Post enrichment helper
function enrichPost(post: Post, currentUserId?: number) {
  const author = db.getUserById(post.authorId);
  const postLikes = db.getLikesForPost(post.id);
  const postComments = db.getCommentsForPost(post.id).map((c) => ({
    ...c,
    user: db.getUserById(c.userId) || { username: "Anonymous", profile: { avatar: null } },
  }));
  const isLiked = currentUserId ? postLikes.some((l) => l.userId === currentUserId) : false;

  return {
    ...post,
    author,
    likesCount: postLikes.length,
    isLiked,
    comments: postComments,
    commentsCount: postComments.length,
  };
}

// ==========================================
// ROUTES
// ==========================================

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// 1. Homepage feed
app.get("/", (req: Request, res: Response) => {
  const rawPosts = db.getAllPosts();
  const enriched = rawPosts.map((p) => enrichPost(p, req.session.userId));
  res.render("feed/homepage", { posts: enriched });
});

// 2. My following feed
app.get("/My-following/", (req: Request, res: Response) => {
  if (!req.session.userId) {
    return res.redirect("/accounts/login/");
  }
  const followingList = db.getFollowing(req.session.userId).map((f) => f.followingId);
  const rawPosts = db.getAllPosts().filter((p) => followingList.includes(p.authorId));
  const enriched = rawPosts.map((p) => enrichPost(p, req.session.userId));
  res.render("feed/my-following", { posts: enriched });
});

// 3. Create post
app.post("/new-posts/", upload.single("image"), (req: Request, res: Response) => {
  if (!req.session.userId) {
    return res.redirect("/accounts/login/");
  }

  const text = req.body.text ? String(req.body.text).trim() : "";
  let imagePath: string | null = null;

  if (req.file) {
    imagePath = `/uploads/${req.file.filename}`;
  } else if (req.body.imageUrl && String(req.body.imageUrl).trim()) {
    imagePath = String(req.body.imageUrl).trim();
  }

  if (text || imagePath) {
    db.createPost({
      authorId: req.session.userId,
      text,
      image: imagePath,
    });
    if (req.session.messages) {
      req.session.messages.push({ type: "success", text: "Post published successfully!" });
    }
  }

  res.redirect("/");
});

// 4. Like / Unlike post (AJAX)
app.post("/post/:id/like/", (req: Request, res: Response) => {
  if (!req.session.userId) {
    return res.status(403).json({ error: "Authentication required" });
  }

  const postId = parseInt(req.params.id, 10);
  const result = db.toggleLike(req.session.userId, postId);

  res.json({
    liked: result.liked,
    likes_count: result.likesCount,
  });
});

// 5. Add comment (AJAX or form post)
app.post("/post/:id/comment/", (req: Request, res: Response) => {
  if (!req.session.userId) {
    return res.status(403).json({ error: "Authentication required" });
  }

  const postId = parseInt(req.params.id, 10);
  const text = req.body.text ? String(req.body.text).trim() : "";

  if (!text) {
    return res.status(400).json({ error: "Comment text cannot be empty." });
  }

  const newComment = db.createComment(req.session.userId, postId, text);
  const commentUser = db.getUserById(req.session.userId);
  const comments = db.getCommentsForPost(postId);

  const isAjax = req.headers["x-requested-with"] === "XMLHttpRequest" || req.headers["content-type"]?.includes("json");

  if (isAjax) {
    const commentWithUser = {
      ...newComment,
      user: commentUser || { username: "Anonymous", profile: { avatar: null } },
    };

    ejs.renderFile(
      path.join(process.cwd(), "views", "feed", "partials", "comment.ejs"),
      { comment: commentWithUser },
      (err, html) => {
        if (err) {
          console.error("Error rendering comment partial:", err);
          return res.status(500).json({ success: false, error: "Rendering failed" });
        }
        res.json({
          success: true,
          html,
          post_id: postId,
          comment_count: comments.length,
        });
      }
    );
  } else {
    res.redirect(`/#comments-modal-${postId}`);
  }
});

// 6. Follow / Unfollow (AJAX)
app.post("/profiles/follow/", (req: Request, res: Response) => {
  if (!req.session.userId) {
    return res.status(403).json({ success: false, error: "Authentication required" });
  }

  const { action, username } = req.body;
  if (!action || !username) {
    return res.status(400).json({ success: false, error: "Missing action or username." });
  }

  const targetUser = db.getUserByUsername(username);
  if (!targetUser) {
    return res.status(404).json({ success: false, error: "User does not exist." });
  }

  if (targetUser.id === req.session.userId) {
    return res.status(400).json({ success: false, error: "You cannot follow yourself." });
  }

  const result = db.toggleFollow(req.session.userId, targetUser.id, action === "unfollow" ? "unfollow" : "follow");
  res.json(result);
});

// 7. Account settings (GET & POST)
app.get("/profiles/account/", (req: Request, res: Response) => {
  if (!req.session.userId) {
    return res.redirect("/accounts/login/");
  }
  res.render("profiles/account");
});

app.post(
  "/profiles/account/",
  upload.single("avatarFile"),
  (req: Request, res: Response) => {
    if (!req.session.userId) {
      return res.redirect("/accounts/login/");
    }

    const user = db.getUserById(req.session.userId);
    if (!user) {
      return res.redirect("/accounts/login/");
    }

    const formType = req.body.form_type;

    if (formType === "account") {
      if (req.body.username && req.body.username.trim()) {
        user.username = req.body.username.trim();
      }
      if (req.body.firstName !== undefined) {
        user.firstName = req.body.firstName.trim();
      }
      if (req.body.lastName !== undefined) {
        user.lastName = req.body.lastName.trim();
      }
      if (req.body.bio !== undefined) {
        user.profile.bio = req.body.bio.trim();
      }
      if (req.file) {
        user.profile.avatar = `/uploads/${req.file.filename}`;
      } else if (req.body.avatarUrl && req.body.avatarUrl.trim()) {
        user.profile.avatar = req.body.avatarUrl.trim();
      }

      req.session.messages = req.session.messages || [];
      req.session.messages.push({
        type: "success",
        text: "Account information updated successfully.",
      });
    } else if (formType === "password") {
      const { oldPassword, newPassword, confirmPassword } = req.body;
      req.session.messages = req.session.messages || [];

      if (oldPassword !== user.password) {
        req.session.messages.push({
          type: "error",
          text: "Current password is incorrect.",
        });
      } else if (newPassword !== confirmPassword) {
        req.session.messages.push({
          type: "error",
          text: "New passwords do not match.",
        });
      } else {
        user.password = newPassword;
        req.session.messages.push({
          type: "success",
          text: "Password changed successfully.",
        });
      }
    }

    res.redirect("/profiles/account/");
  }
);

// 8. Notifications list
app.get("/notifications/", (req: Request, res: Response) => {
  if (!req.session.userId) {
    return res.redirect("/accounts/login/");
  }

  const rawNotifications = db.getNotifications(req.session.userId);
  const notificationsWithSender = rawNotifications.map((n) => ({
    ...n,
    sender: db.getUserById(n.senderId) || { username: "Someone", profile: { avatar: null } },
  }));

  // Mark notifications as read
  db.markNotificationsAsRead(req.session.userId);

  res.render("notifications/notifications", {
    notifications: notificationsWithSender,
  });
});

// 9. Profile Detail
app.get("/profiles/:username/", (req: Request, res: Response) => {
  const username = req.params.username;
  const profileUser = db.getUserByUsername(username);

  if (!profileUser) {
    return res.status(404).send("User not found");
  }

  const userPosts = db
    .getAllPosts()
    .filter((p) => p.authorId === profileUser.id)
    .map((p) => enrichPost(p, req.session.userId));

  const followersList = db.getFollowers(profileUser.id);
  const followingList = db.getFollowing(profileUser.id);
  const youFollow = req.session.userId ? db.isFollowing(req.session.userId, profileUser.id) : false;

  res.render("profiles/detail", {
    profile_user: profileUser,
    userPosts,
    followersCount: followersList.length,
    followingCount: followingList.length,
    youFollow,
  });
});

// 10. Followers list
app.get("/profiles/:username/followers/", (req: Request, res: Response) => {
  const username = req.params.username;
  const profileUser = db.getUserByUsername(username);

  if (!profileUser) {
    return res.status(404).send("User not found");
  }

  const followersList = db
    .getFollowers(profileUser.id)
    .map((f) => db.getUserById(f.followedById))
    .filter((u): u is User => u !== null);

  res.render("profiles/followers", {
    profile_user: profileUser,
    followers: followersList,
  });
});

// 11. Following list
app.get("/profiles/:username/following/", (req: Request, res: Response) => {
  const username = req.params.username;
  const profileUser = db.getUserByUsername(username);

  if (!profileUser) {
    return res.status(404).send("User not found");
  }

  const followingList = db
    .getFollowing(profileUser.id)
    .map((f) => db.getUserById(f.followingId))
    .filter((u): u is User => u !== null);

  res.render("profiles/following", {
    profile_user: profileUser,
    following: followingList,
  });
});

// 12. Auth: Login
app.get("/accounts/login/", (_req: Request, res: Response) => {
  res.render("account/login");
});

app.post("/accounts/login/", (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = db.getUserByUsername(username);

  if (user && user.password === password) {
    req.session.userId = user.id;
    req.session.messages = [{ type: "success", text: `Welcome back, ${user.username}!` }];
    return res.redirect("/");
  }

  req.session.messages = [{ type: "error", text: "Invalid username or password." }];
  res.redirect("/accounts/login/");
});

// 13. Auth: Signup
app.get("/accounts/signup/", (_req: Request, res: Response) => {
  res.render("account/signup");
});

app.post("/accounts/signup/", (req: Request, res: Response) => {
  const { username, firstName, lastName, password } = req.body;

  if (!username || !password) {
    req.session.messages = [{ type: "error", text: "Username and password are required." }];
    return res.redirect("/accounts/signup/");
  }

  if (db.getUserByUsername(username)) {
    req.session.messages = [{ type: "error", text: "Username is already taken." }];
    return res.redirect("/accounts/signup/");
  }

  const newUser = db.createUser({
    username: username.trim(),
    password: password.trim(),
    firstName: (firstName || "").trim(),
    lastName: (lastName || "").trim(),
    dateJoined: new Date().toISOString(),
    profile: {
      bio: "",
      avatar: null,
    },
  });

  req.session.userId = newUser.id;
  req.session.messages = [{ type: "success", text: `Welcome to SocialNet, ${newUser.username}!` }];
  res.redirect("/");
});

// 14. Auth: Logout
app.all("/accounts/logout/", (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) console.error("Error destroying session:", err);
    res.redirect("/accounts/login/");
  });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Social Network Server running on http://0.0.0.0:${PORT}`);
});
