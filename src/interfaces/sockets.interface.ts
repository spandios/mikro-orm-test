import { isEmpty } from '@utils/util';

export class SocketMessage {
  roomName: string;
  msg: string;

  constructor(roomName: string, msg: string) {
    this.roomName = roomName;
    this.msg = msg;
  }

  validate() {
    return !(isEmpty(this.roomName) || isEmpty(this.msg));
  }
}

export class SocketError {
  errorCode: string;
  msg: string;

  constructor(socketException: any) {
    this.errorCode = socketException.errorCode;
    this.msg = socketException.msg;
  }
}
