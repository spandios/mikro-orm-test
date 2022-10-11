import { DI } from '@databases';
import { ChatRoom } from '@entities/ChatRoom';

class ChatRoomService {
  public async checkExistRoom(roomId: string): Promise<boolean> {
    const chatRoom: ChatRoom = await DI.chatRoomRepository.findOne({ roomId });
    return chatRoom != null;
  }

  // public async findUserById(userId: string): Promise<User> {
  //   if (isEmpty(userId)) throw new HttpException(400, "UserId is empty");
  //
  //   const findUser: User = await DI.userRepository.findOne(userId);
  //   if (!findUser) throw new HttpException(409, "User doesn't exist");
  //
  //   return findUser;
  // }
  //
  // public async createUser(userData: CreateUserDto): Promise<User> {
  //   if (isEmpty(userData)) throw new HttpException(400, "userData is empty");
  //
  //   const findUser: User = await DI.userRepository.findOne({ email: userData.email });
  //   if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);
  //
  //   const hashedPassword = await hash(userData.password, 10);
  //   const createUserData: User = DI.userRepository.create({ ...userData, password: hashedPassword });
  //
  //   await DI.em.persistAndFlush(createUserData);
  //
  //   return createUserData;
  // }
  //
  // public async updateUser(userId: string, userData: CreateUserDto): Promise<User> {
  //   if (isEmpty(userData)) throw new HttpException(400, "userData is empty");
  //
  //   if (userData.email) {
  //     const findUser: User = await DI.userRepository.findOne({ email: userData.email });
  //     if (findUser && findUser.id !== userId) throw new HttpException(409, `This email ${userData.email} already exists`);
  //   }
  //
  //   if (userData.password) {
  //     const hashedPassword = await hash(userData.password, 10);
  //     userData = { ...userData, password: hashedPassword };
  //   }
  //
  //   const updateUserById: User = await DI.userRepository.findOne(userId);
  //   wrap(updateUserById).assign(userData);
  //   if (!updateUserById) throw new HttpException(409, "User doesn't exist");
  //
  //   return updateUserById;
  // }
  //
  // public async deleteUser(userId: string): Promise<User> {
  //   const findUser = await DI.userRepository.findOne(userId);
  //
  //   if (!findUser) throw new HttpException(409, "User doesn't exist");
  //   await DI.userRepository.removeAndFlush(findUser);
  //
  //   return findUser;
  // }
}

export default ChatRoomService;
