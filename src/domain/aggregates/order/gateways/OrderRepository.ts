import mysql, { OkPacket } from 'mysql';
import * as dotenv from 'dotenv';
import { OrderGatewayInterface } from '../interfaces/gateways/OrderGatewayInterface';
import { IOrderItem } from '../interfaces/IOrderItem';

export class MySQLOrderRepository implements OrderGatewayInterface {
  private connection: mysql.Connection;

  constructor() {
    dotenv.config();
    this.connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    this.connection.connect();
  }

  beginTransaction(): void {
    this.connection.beginTransaction();
  }

  commit(): void {
    this.connection.commit();
  }

  rollback(): void {
    this.connection.rollback();
  }

  async getOrders(orderId?: number): Promise<any> {
    const values = [orderId];
    var myQuery = `
            SELECT
                O.id, O.order_date, O.order_total, O.customer_id, O.order_status,
                JSON_ARRAYAGG(
                  JSON_OBJECT(
                    'item', I.item_name,
                    'qty', OI.order_item_qtd,
                    'price', I.item_price
                  )
                ) AS order_items
            FROM orders O
            LEFT OUTER JOIN order_item OI ON OI.order_id = O.id 
            LEFT OUTER JOIN itens I ON I.id = OI.item_id`;
    if (orderId) {
      myQuery = myQuery + ` WHERE O.id = ?`;
    }
    myQuery =
      myQuery +
      ` 
            GROUP BY O.id`;
    try {
      return await this.commitDB(myQuery, values);
    } catch (error) {
      console.log('Error to query orders', error);
    } finally {
      this.closeConnection();
    }
  }

  private async commitDB(query: string, values: any[]): Promise<OkPacket> {
    return new Promise((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results);
      });
    });
  }

  async newOrder(
    customerId: number,
    total: number,
    order_status: number,
  ): Promise<number> {
    try {
      const insertQuery =
        'INSERT INTO orders (order_date, order_total, customer_id, order_status) VALUES (NOW(), ?, ?, ?)';
      const values = [total, customerId, order_status];
      const result = await this.commitDB(insertQuery, values);

      return result.insertId;
    } catch (err) {
      const msg = 'Error inserting a new Order';
      console.log(msg, err);
      throw new Error(msg);
    } finally {
      this.closeConnection();
    }
  }

  async insertOrderItems(orderItems: IOrderItem[]): Promise<void> {
    try {
      const insertItemsQuery =
        'INSERT INTO order_item (order_id, item_id, order_item_qtd) VALUES ?';
      const formattedItems = orderItems.map((item) => [
        item.order_id,
        item.item_id,
        item.order_item_qtd,
      ]);
      await this.commitDB(insertItemsQuery, [formattedItems]);
    } catch (err) {
      const msg = 'Error inserting Order Items';
      console.log(msg, err);
      throw new Error(msg);
    } finally {
      this.closeConnection();
    }
  }

  async getItemPrices(items: number[]): Promise<any> {
    try {
      const query =
        'SELECT id, item_price from itens WHERE id IN (?) ORDER BY ID';
      return await this.commitDB(query, [items]);
    } catch (err) {
      const msg = 'Error getting Order Items prices';
      console.log(msg, err);
      throw new Error(msg);
    } finally {
      this.closeConnection();
    }
  }

  async updateOrderStatus(
    order_id: number,
    order_status: number,
  ): Promise<any> {
    try {
      const query = 'UPDATE orders SET order_status = (?) WHERE id = (?)';
      return await this.commitDB(query, [order_status, order_id]);
    } catch (err) {
      const msg = 'Error updatind Order status';
      console.log(msg, err);
      throw new Error(msg);
    } finally {
      this.closeConnection();
    }
  }

  closeConnection(): void {
    console.log('Close connection');
  }
}
