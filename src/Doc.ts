import { Collection } from './Collection'
import { SubscriptionFn } from './Subscription'
import { Client, Request } from './Client'

export type DocSnapshotRegister<T> = (fn: SubscriptionFn<T>, d: Doc<T>) => void

export class Doc<T> {
  private id: string
  private collection: Collection
  private client: Client
  private onSnapshotRegister: DocSnapshotRegister<T>

  constructor (id: string, collection: Collection, client: Client, onSnapshotRegister: DocSnapshotRegister<T>) {
    this.id = id
    this.collection = collection
    this.client = client
    this.onSnapshotRegister = onSnapshotRegister
  }

  delete = async () => {
    const res = await this.client.request({
      ...this.request(),
      method: 'DELETE',
    }).send()
    return res.data
  }

  set = async (data: T) => {
    // TODO: check validatoon results
    const isValid = await this.collection.validate(data)
    if (!isValid) {
      throw new Error('doc is not valid')
    }

    const res = await this.client.request({
      url: `/${this.collection.id}/${this.id}`,
      method: 'PUT',
      data,
    }).send()

    return res.data
  }

  get = async () => {
    const res = await this.client.request(this.request()).send()
    return res.data
  }

  key = () => {
    return `doc:${this.collection.id}/${this.id}`
  }

  onSnapshot = (fn: SubscriptionFn<T>) => {
    this.onSnapshotRegister(fn, this)
  }

  request = (): Request => ({
    url: `/${this.collection.id}/${this.id}`,
    method: 'GET',
  })
}
