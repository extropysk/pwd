import { ObjectId } from 'mongodb'

export interface Base {
  _id: ObjectId
}

export type WithoutId<T extends Base> = Omit<T, '_id'>

export type Projection<T extends Base> = {
  [key in keyof T]?
}
