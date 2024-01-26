import IQueueService from '../ports/IQueueService';
import * as dotenv from 'dotenv';
import { SQS } from 'aws-sdk';
import cron from 'node-cron';
import { OrderController } from '../../domain/aggregates/order/controllers/OrderController';

export default class AWSSQSAdapter implements IQueueService {
  private sqs = new SQS();
  private AWS = require('aws-sdk');
  private static _instance: AWSSQSAdapter;

  private constructor() {
    dotenv.config();

    this.AWS.config.update({ region: process.env.AWS_REGION });

    const polling_interval = Number(process.env.MSG_POLLING_INTERVAL);

    //exemple:
    // cron.schedule('*/5 * * * * *', .....)
    cron.schedule('*/' + polling_interval.toString() + ' * * * * *', () => {
      this.receiveMessagePaymentProcessed();
      this.receiveMessageFinishOrder();
    });
  }

  static getInstance(): AWSSQSAdapter {
    if (!this._instance) {
      this._instance = new AWSSQSAdapter();
    }
    return this._instance;
  }

  async sendMessage({
    message,
    QueueOutputUrl,
    MessageGroupId,
  }: {
    message: any;
    QueueOutputUrl: string;
    MessageGroupId: string;
  }) {
    const params: SQS.Types.SendMessageRequest = {
      QueueUrl: QueueOutputUrl,
      MessageBody: JSON.stringify(message),
      MessageGroupId,
      MessageDeduplicationId: `${this.messageID().toString()}`,
    };

    try {
      await this.sqs.sendMessage(params).promise();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  async receiveMessagePaymentProcessed() {
    try {
      const receiveParams: SQS.Types.ReceiveMessageRequest = {
        QueueUrl: `${process.env.AWS_INPUT_PAYMENT_QUEUE_PROCESSED_URL}`,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 5,
      };

      const data = await this.sqs.receiveMessage(receiveParams).promise();
      if (data.Messages && data.Messages.length > 0) {
        for (const element of data.Messages) {
          const message = element;
          // Process the message
          const msgBody = JSON.parse(String(message.Body));
          console.log({ msgBody });
          await OrderController.updateOrderStatus({
            order_id: Number(msgBody.order_id),
            status: msgBody.payment_status,
          });

          console.log('Deleting message.');
          await this.sqs
            .deleteMessage({
              QueueUrl: `${process.env.AWS_INPUT_PAYMENT_QUEUE_PROCESSED_URL}`,
              ReceiptHandle: message.ReceiptHandle!,
            })
            .promise();
        }
        console.log('Message deleted.');
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  }

  async receiveMessageFinishOrder() {
    try {
      const receiveParams: SQS.Types.ReceiveMessageRequest = {
        QueueUrl: `${process.env.AWS_INPUT_ORDER_QUEUE_FINISHED_URL}`,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 5,
      };

      const data = await this.sqs.receiveMessage(receiveParams).promise();

      if (data.Messages && data.Messages.length > 0) {
        for (const element of data.Messages) {
          const message = element;
          // Process the message
          const msgBody = JSON.parse(String(message.Body));
          console.log({ msgBody });
          await OrderController.updateOrderStatus({
            order_id: Number(msgBody.order_id),
            status: 4,
          });

          console.log('Deleting message.');
          await this.sqs
            .deleteMessage({
              QueueUrl: `${process.env.AWS_INPUT_ORDER_QUEUE_FINISHED_URL}`,
              ReceiptHandle: message.ReceiptHandle!,
            })
            .promise();
        }
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  }

  // Implement timestamp logical here
  messageID(): number {
    return Date.now();
  }
}
