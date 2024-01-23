export default interface IQueueService {
  sendMessage(message: string): any;
  receiveMessage(): any;
  messageID(): number;
}
