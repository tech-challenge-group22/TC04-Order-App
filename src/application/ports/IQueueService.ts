export default interface IQueueService {
  sendMessage({
    message,
    QueueOutputUrl,
    MessageGroupId,
  }: {
    message: any;
    QueueOutputUrl: string;
    MessageGroupId: string;
  }): any;
  receiveMessagePaymentProcessed(): any;
  receiveMessageFinishOrder(): any;
  messageID(): number;
}
