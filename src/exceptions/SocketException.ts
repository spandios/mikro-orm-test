const SocketException = {
  EMPTY_ROOM_ID: { errorCode: 'E00001', msg: '채팅방 아이디가 없습니다.' },
  NOT_FOUND_ROOM: { errorCode: 'E00002', msg: '채팅방을 찾을 수 없습니다.' },
  JWT_EXPIRED: { errorCode: 'E00003', msg: 'JWT 만료' },
  JWT_ERROR: { errorCode: 'E00004', msg: 'JWT 검증 오류' },
};

export default SocketException;
