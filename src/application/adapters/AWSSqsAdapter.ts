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
      const data = await this.sqs.sendMessage(params).promise();
      console.log('Message sent:', data.MessageId);
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
        console.log(
          'Quantidade mensagens recebidas: FinishOrder' + data.Messages.length,
        );
        for (const element of data.Messages) {
          const message = element;

          console.log('Received message:', message.Body);
          console.log('Message Id: ' + message.MessageId);

          // Process the message
          const msgBody = JSON.parse(String(message.Body));
          console.log({ msgBody });
          // teste mockado
          // const msgBody = {
          //   order_id: 7,
          //   status: 'Aprovado',
          // };
          console.log('Order Id: ' + msgBody.order_id);

          await OrderController.updateOrderStatus({
            order_id: Number(msgBody.order_id),
            status: msgBody.status,
          });

          console.log('Deleting payment message Id: ' + message.MessageId);
          await this.sqs
            .deleteMessage({
              QueueUrl: `${process.env.AWS_INPUT_PAYMENT_QUEUE_PROCESSED_URL}`,
              ReceiptHandle: message.ReceiptHandle!,
            })
            .promise();
          console.log('Payment message deleted.');
        }
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
        console.log(
          'Quantidade mensagens recebidas: FinishOrder' + data.Messages.length,
        );
        for (const element of data.Messages) {
          const message = element;

          console.log('Received message:', message.Body);
          console.log('Message Id: ' + message.MessageId);

          // Process the message
          const msgBody = JSON.parse(String(message.Body));
          console.log('Order Id: ' + msgBody.order_id);

          await OrderController.updateOrderStatus({
            order_id: Number(msgBody.order_id),
            status: 'Finalizado',
          });

          console.log('Deleting message Id: ' + message.MessageId);
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
