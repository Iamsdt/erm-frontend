/**
 * User Test Fixtures
 * 
 * Predefined user data for consistent testing
 */

export const adminUser = {
  id: 1,
  name: "Admin User",
  email: "admin@example.com",
  userName: "admin",
  userRole: "admin",
  avatar: "https://i.pravatar.cc/150?img=1",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  isActive: true,
  permissions: ["read", "write", "delete", "admin"],
}

export const regularUser = {
  id: 2,
  name: "John Doe",
  email: "john@example.com",
  userName: "johndoe",
  userRole: "user",
  avatar: "https://i.pravatar.cc/150?img=2",
  createdAt: "2024-01-15T00:00:00.000Z",
  updatedAt: "2024-01-15T00:00:00.000Z",
  isActive: true,
  permissions: ["read", "write"],
}

export const guestUser = {
  id: 3,
  name: "Guest User",
  email: "guest@example.com",
  userName: "guest",
  userRole: "guest",
  avatar: "https://i.pravatar.cc/150?img=3",
  createdAt: "2024-02-01T00:00:00.000Z",
  updatedAt: "2024-02-01T00:00:00.000Z",
  isActive: true,
  permissions: ["read"],
}

export const inactiveUser = {
  id: 4,
  name: "Inactive User",
  email: "inactive@example.com",
  userName: "inactive",
  userRole: "user",
  avatar: "https://i.pravatar.cc/150?img=4",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-03-01T00:00:00.000Z",
  isActive: false,
  permissions: [],
}

export const testUsers = [adminUser, regularUser, guestUser]

export const allUsers = [adminUser, regularUser, guestUser, inactiveUser]

export default {
  adminUser,
  regularUser,
  guestUser,
  inactiveUser,
  testUsers,
  allUsers,
}
