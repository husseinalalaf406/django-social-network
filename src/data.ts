export interface User {
  id: number;
  username: string;
  password?: string;
  firstName: string;
  lastName: string;
  dateJoined: string;
  profile: {
    bio: string;
    avatar: string | null;
  };
}

export interface Post {
  id: number;
  authorId: number;
  text: string;
  image: string | null;
  date: string;
}

export interface Like {
  id: number;
  userId: number;
  postId: number;
  createdAt: string;
}

export interface Comment {
  id: number;
  userId: number;
  postId: number;
  text: string;
  createdAt: string;
}

export interface Follower {
  id: number;
  followedById: number;
  followingId: number;
}

export interface Notification {
  id: number;
  recipientId: number;
  senderId: number;
  notificationType: "like" | "comment" | "follow";
  postId?: number;
  commentId?: number;
  isRead: boolean;
  createdAt: string;
}

// In-Memory Data Store with initial seed data
export const users: User[] = [
  {
    id: 1,
    username: "hussein",
    password: "password123",
    firstName: "Hussein",
    lastName: "Al-Alaf",
    dateJoined: "2024-01-15T10:00:00Z",
    profile: {
      bio: "Full-stack developer passionate about open source and community building.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    },
  },
  {
    id: 2,
    username: "sarah_dev",
    password: "password123",
    firstName: "Sarah",
    lastName: "Jenkins",
    dateJoined: "2024-02-10T14:30:00Z",
    profile: {
      bio: "Frontend architect & UI explorer. Coffee lover ☕",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
    },
  },
  {
    id: 3,
    username: "marcus_tech",
    password: "password123",
    firstName: "Marcus",
    lastName: "Vance",
    dateJoined: "2024-03-01T09:15:00Z",
    profile: {
      bio: "Building distributed systems and cloud infrastructure.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    },
  },
  {
    id: 4,
    username: "elena_design",
    password: "password123",
    firstName: "Elena",
    lastName: "Rostova",
    dateJoined: "2024-03-20T16:45:00Z",
    profile: {
      bio: "Product designer crafting delightful user experiences and design systems.",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
    },
  },
];

let nextPostId = 5;
let nextCommentId = 6;
let nextLikeId = 8;
let nextFollowId = 6;
let nextNotificationId = 7;
let nextUserId = 5;

export const posts: Post[] = [
  {
    id: 1,
    authorId: 2,
    text: "Just shipped our brand new web application! 🚀 Really happy with how the interface turned out. Tailwind CSS and modern reactive components make UI building so much faster.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1000&auto=format&fit=crop&q=80",
    date: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 2,
    authorId: 3,
    text: "Exploring high-performance node runtimes and streaming architecture today. Clean code and minimal latency are always the goal.",
    image: null,
    date: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
  {
    id: 3,
    authorId: 4,
    text: "Nature walk and weekend photography inspiration 🌿 Designing around natural organic color palettes this week.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop&q=80",
    date: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: 4,
    authorId: 1,
    text: "Welcome to the social network! Connect with developers, share thoughts, like, comment, and collaborate seamlessly.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=80",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

export const likes: Like[] = [
  { id: 1, userId: 1, postId: 1, createdAt: new Date().toISOString() },
  { id: 2, userId: 3, postId: 1, createdAt: new Date().toISOString() },
  { id: 3, userId: 4, postId: 1, createdAt: new Date().toISOString() },
  { id: 4, userId: 1, postId: 3, createdAt: new Date().toISOString() },
  { id: 5, userId: 2, postId: 4, createdAt: new Date().toISOString() },
];

export const comments: Comment[] = [
  {
    id: 1,
    userId: 1,
    postId: 1,
    text: "Looks incredible! Love the typography and crisp borders.",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 2,
    userId: 4,
    postId: 1,
    text: "The color harmony is spot on. Great work!",
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: 3,
    userId: 2,
    postId: 3,
    text: "That landscape shot is breathtaking!",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 4,
    userId: 3,
    postId: 4,
    text: "Great to be here!",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
];

export const followers: Follower[] = [
  { id: 1, followedById: 1, followingId: 2 },
  { id: 2, followedById: 1, followingId: 4 },
  { id: 3, followedById: 2, followingId: 1 },
  { id: 4, followedById: 3, followingId: 1 },
  { id: 5, followedById: 4, followingId: 1 },
];

export const notifications: Notification[] = [
  {
    id: 1,
    recipientId: 1,
    senderId: 2,
    notificationType: "like",
    postId: 4,
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
  },
  {
    id: 2,
    recipientId: 1,
    senderId: 3,
    notificationType: "comment",
    postId: 4,
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
  },
  {
    id: 3,
    recipientId: 1,
    senderId: 4,
    notificationType: "follow",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
];

// Helper database functions
export const db = {
  getUserById(id: number) {
    return users.find((u) => u.id === id) || null;
  },
  getUserByUsername(username: string) {
    return users.find((u) => u.username.toLowerCase() === username.toLowerCase()) || null;
  },
  createUser(data: Omit<User, "id">) {
    const newUser: User = { id: nextUserId++, ...data };
    users.push(newUser);
    return newUser;
  },
  getAllPosts() {
    return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },
  getPostById(id: number) {
    return posts.find((p) => p.id === id) || null;
  },
  createPost(data: { authorId: number; text: string; image: string | null }) {
    const newPost: Post = {
      id: nextPostId++,
      authorId: data.authorId,
      text: data.text,
      image: data.image,
      date: new Date().toISOString(),
    };
    posts.unshift(newPost);
    return newPost;
  },
  getLikesForPost(postId: number) {
    return likes.filter((l) => l.postId === postId);
  },
  getUserLikes(userId: number) {
    return likes.filter((l) => l.userId === userId).map((l) => l.postId);
  },
  toggleLike(userId: number, postId: number) {
    const post = this.getPostById(postId);
    if (!post) return { liked: false, likesCount: 0 };

    const existingIdx = likes.findIndex((l) => l.userId === userId && l.postId === postId);
    let liked = false;
    if (existingIdx >= 0) {
      likes.splice(existingIdx, 1);
      liked = false;
    } else {
      likes.push({
        id: nextLikeId++,
        userId,
        postId,
        createdAt: new Date().toISOString(),
      });
      liked = true;

      // Create notification if post author is not the liker
      if (post.authorId !== userId) {
        notifications.unshift({
          id: nextNotificationId++,
          recipientId: post.authorId,
          senderId: userId,
          notificationType: "like",
          postId: post.id,
          isRead: false,
          createdAt: new Date().toISOString(),
        });
      }
    }

    const likesCount = likes.filter((l) => l.postId === postId).length;
    return { liked, likesCount };
  },
  getCommentsForPost(postId: number) {
    return comments
      .filter((c) => c.postId === postId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  },
  createComment(userId: number, postId: number, text: string) {
    const post = this.getPostById(postId);
    const newComment: Comment = {
      id: nextCommentId++,
      userId,
      postId,
      text,
      createdAt: new Date().toISOString(),
    };
    comments.push(newComment);

    if (post && post.authorId !== userId) {
      notifications.unshift({
        id: nextNotificationId++,
        recipientId: post.authorId,
        senderId: userId,
        notificationType: "comment",
        postId: post.id,
        commentId: newComment.id,
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    }

    return newComment;
  },
  getFollowers(userId: number) {
    return followers.filter((f) => f.followingId === userId);
  },
  getFollowing(userId: number) {
    return followers.filter((f) => f.followedById === userId);
  },
  isFollowing(followedById: number, followingId: number) {
    return followers.some((f) => f.followedById === followedById && f.followingId === followingId);
  },
  toggleFollow(followedById: number, followingId: number, action: "follow" | "unfollow") {
    if (action === "follow") {
      const exists = followers.some((f) => f.followedById === followedById && f.followingId === followingId);
      if (!exists) {
        followers.push({
          id: nextFollowId++,
          followedById,
          followingId,
        });
        notifications.unshift({
          id: nextNotificationId++,
          recipientId: followingId,
          senderId: followedById,
          notificationType: "follow",
          isRead: false,
          createdAt: new Date().toISOString(),
        });
      }
      return { success: true, wording: "Unfollow" };
    } else {
      const idx = followers.findIndex((f) => f.followedById === followedById && f.followingId === followingId);
      if (idx >= 0) {
        followers.splice(idx, 1);
      }
      return { success: true, wording: "Follow" };
    }
  },
  getNotifications(userId: number) {
    return notifications
      .filter((n) => n.recipientId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  getUnreadNotificationCount(userId: number) {
    return notifications.filter((n) => n.recipientId === userId && !n.isRead).length;
  },
  markNotificationsAsRead(userId: number) {
    notifications.forEach((n) => {
      if (n.recipientId === userId) n.isRead = true;
    });
  },
};
