/**
 * Comment Test Fixtures
 *
 * Predefined comment data for consistent testing
 */

import { regularUser, adminUser } from "./users"

export const comment1 = {
  id: 1,
  postId: 1,
  userId: regularUser.id,
  text: "This is a great post! Thanks for sharing.",
  author: {
    id: regularUser.id,
    name: regularUser.name,
    avatar: regularUser.avatar,
  },
  createdAt: "2024-01-15T10:00:00.000Z",
  updatedAt: "2024-01-15T10:00:00.000Z",
  likes: 5,
  replies: [],
}

export const comment2 = {
  id: 2,
  postId: 1,
  userId: adminUser.id,
  text: "I completely agree with this perspective.",
  author: {
    id: adminUser.id,
    name: adminUser.name,
    avatar: adminUser.avatar,
  },
  createdAt: "2024-01-15T11:00:00.000Z",
  updatedAt: "2024-01-15T11:00:00.000Z",
  likes: 3,
  replies: [],
}

export const commentWithReplies = {
  id: 3,
  postId: 1,
  userId: regularUser.id,
  text: "What do you think about this?",
  author: {
    id: regularUser.id,
    name: regularUser.name,
    avatar: regularUser.avatar,
  },
  createdAt: "2024-01-15T12:00:00.000Z",
  updatedAt: "2024-01-15T12:00:00.000Z",
  likes: 10,
  replies: [
    {
      id: 4,
      userId: adminUser.id,
      text: "I think it's very interesting!",
      author: {
        id: adminUser.id,
        name: adminUser.name,
        avatar: adminUser.avatar,
      },
      createdAt: "2024-01-15T12:30:00.000Z",
      likes: 2,
    },
  ],
}

export const longComment = {
  id: 5,
  postId: 1,
  userId: regularUser.id,
  text: "This is a very long comment that contains a lot of text. ".repeat(10),
  author: {
    id: regularUser.id,
    name: regularUser.name,
    avatar: regularUser.avatar,
  },
  createdAt: "2024-01-15T13:00:00.000Z",
  updatedAt: "2024-01-15T13:00:00.000Z",
  likes: 0,
  replies: [],
}

export const testComments = [comment1, comment2, commentWithReplies]

export const allComments = [comment1, comment2, commentWithReplies, longComment]

export default {
  comment1,
  comment2,
  commentWithReplies,
  longComment,
  testComments,
  allComments,
}
