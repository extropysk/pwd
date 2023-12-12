export enum Permission {
  NONE = 0,
  READ = 1 << 0,
  CREATE = 1 << 1,
  UPDATE = 1 << 2,
  DELETE = 1 << 3,
  READ_WRITE = READ | CREATE | UPDATE | DELETE,
}
