// import base from './base'
// import createTask from './task'

// export default async function main() {
//   const task = createTask({}, base)
//   try {
//     await task.up()
//   } catch(e) {
//     try {
//       await task.down()
//     } catch(es) {
//       throw new Error([e, ...es].join('\n'))
//     }
//   }
// }

import app from './components'
import base from './base'
import { createRootTask } from './task'

const tasks = {
  children: [{
    id: '1',
    state: 0,
    title: '1',
    up() { console.log(1); setTimeout(() => this.state = 1, 3000) },
    children: [{
      id: '11',
      title: '11',
      state: 0,
      up() { console.log(11); setTimeout(() => this.state = 3, 1000) },
      children: [{
        id: '111',
        title: '111',
        up() { console.log(111) }
      }]
    },{
      id: '12',
      title: '12',
      up() { console.log(12) }
    }]
  }]
}

export default function main() {
  app(createRootTask(process.cwd(), {}, base))
}
