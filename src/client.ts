import * as ipc from 'node-ipc'
// import {Socket} from 'net'

ipc.config.id   = 'hello'
// ipc.config.retry= 1500

ipc.connectTo(
  'world',
  () => {
    ipc.of.world.on(
      'connect',
      () => {
        ipc.log('Received: CONNECT')
        ipc.log('Sending: SCREENSHOT')
        ipc.of.world.emit('screenshot', '')
      }
    )

    ipc.of.world.on(
      'disconnect',
      () => {
        ipc.log('Received: DISCONNECT')
      }
    )

    ipc.of.world.on(
      'screenshot.done',
      (data : string) => {
        ipc.log('Received: SCREENSHOT.DONE')
        ipc.log('Sending: QUIT')
        ipc.of.world.emit('quit', '')
        process.exit()
      }
    )
  }
)
