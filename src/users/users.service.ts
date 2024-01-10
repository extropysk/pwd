import { Inject } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { Db, Filter, ObjectId } from 'mongodb'
import { Permission } from 'src/core/enums/permission.enum'
import { Payload } from 'src/core/interfaces/payload.interface'
import { DATABASE } from 'src/db/database.module'
import { Projection, WithoutId } from 'src/db/interfaces/base.interface'
import { User } from 'src/users/interfaces/user.interface'

const COLLECTION = 'users'

export class UsersService {
  constructor(
    @Inject(DATABASE)
    private db: Db
  ) {}

  async getCurrentUser(current: Payload): Promise<User> {
    return await this.findOne({ _id: new ObjectId(current.sub) }, { password: 0 })
  }

  async findOne(filter: Filter<User>, projection?: Projection<User>): Promise<User> {
    return await this.db.collection<User>(COLLECTION).findOne(filter, { projection })
  }

  async updatePermissions(id: ObjectId, permissions: Record<string, Permission>) {
    const user = {}
    Object.keys(permissions).forEach((key) => {
      user[`permissions.${key}`] = permissions[key]
    })

    return await this.db.collection<User>(COLLECTION).updateOne({ _id: id }, { $set: user })
  }

  async insert(user: WithoutId<User>): Promise<User> {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10)
    }

    const { insertedId: _id } = await this.db
      .collection<WithoutId<User>>(COLLECTION)
      .insertOne(user)
    return { ...user, _id, password: undefined }
  }

  async upsert(user: WithoutId<User>): Promise<User> {
    return await this.db
      .collection<User>(COLLECTION)
      .findOneAndUpdate(
        { email: user.email },
        { $set: user },
        { upsert: true, returnDocument: 'after' }
      )
  }
}
