/**
 * model
 *
 * app model layer, used for redux store
 *
 * @flow
 */

// import immer from 'immer'

///code

class Database {
  constructor(models, payloads) {
    this.models = models
    this.values = payloads
  }

  cmd(model, oper, options) {
    switch(oper) {
      case 'R':
      case 'C':
      case 'U':
      case 'D':
      default:
        throw new Error(`Unknow operator`)
    }
  }

  commit() {}
  rollback() {}
}


const db = new Database({
  user: {
    field: {
      id: 'string',
      name: 'string',
      age: {
        type: 'number',
        min: 10
      }
    },
    relation: {
      group: 'belongsTo'
    }
  },
  group: {
    field: {
      id: 'string',
      name: 'string'
    },
    relation: {
      users: 'hasMany'
    }
  }
})

class Model {
  constructor(name, records, validator, find) {
    this.name = name
    this.fields = []
    this.relations = []
    this.records = []
    this.validator = validator
    this.find = find

    this.Record = class extends Record {
      constructor(props) {
        super(props)

      }

      get ['42']() {

      }
    }
  }

  /**
   * create a new record
   */
  new() {
    const record = new Record()
    record.isNew = true
  }

  /**
   * @example
   * User.find(options).then(users => {})
   */
  find(options): Promise<*> {
    return this.find(this.name, 'R', options)
  }
  all() {}
  findById() {}
  findOne() {}

  count() {}
  sum() {}

  insert(data) {
    this.records.push(new Record(data, this))
    return this
  }
  insertOne() {}
  insertMany() {}

  update() {}
  updateOne() {}
  updateMany() {}
  replaceOne() {}

  upsert() {}
  deleteOne() {}
  deleteMany() {}

  toJson() {}
  toString() {}
}

class Record {
  constructor(obj, model) {
    this.object = obj
    this.model = model
    this._name = {}
  }

  get name() {
    return this._name
  }

  set name(val) {
    this._name = val
    return this
  }

  save() {
    console.log(this)
  }
}

class Adapter {
  constructor(props) {

  }


}

const users = new Model('user', [])
users
  .insert({ name: 'foo' })
  .insert({ name: 'bar' })


const User = new Model('user', { name: 'string', age: 'integer' })
const user = User.new()
user.name = 'baz'
user.age = 18
user.save().then(({ id }) => {
  console.log(id)  //=> 1
})


/// test

import assert from 'assert'

describe('Model', () => {
  it('should actions', () => {

  })
})

import * as React from 'react'
import { connect } from 'react-redux'
class Component extends React.PureComponent {
  componentDidMount(): void {
    const { request, dispatch } = this.props
    dispatch({ type: 'user.request' })
    request('/user').then(data => {
      dispatch({ type: 'user.success', payload: data })
    }, error => {
      dispatch({ type: 'user.failure', payload: error })
    })

    // db.user.findAll(dispatch)
  }
  render() {
    const { padding, data, error } = this.props
    return padding
      ? null // <Loading />
      : error
      ? null // <ErrorMessage error={error} />
      : !data
      ? null // <EmptyView />
      : 42   // <DataView />
  }
}

connect(
  function mapStateToProps(state) {
    return {
      ...state.db.toSelector('user')
    }
  }
)(Component)
