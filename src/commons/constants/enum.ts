export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export enum UserContactStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  BLOCKED = 'BLOCKED',
}

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  FILE = 'FILE',
  TEXT_IMAGE = 'TEXT_IMAGE',
}

export enum NotificationType {
  NEW_MESSAGE = 'NEW_MESSAGE',
  ADD_FRIEND = 'ADD_FRIEND',
  FRIEND_ACCEPTED = 'FRIEND_ACCEPTED',
}
