import { Given, Then } from '@cucumber/cucumber';
import * as sinon from 'sinon';
import assert from 'assert';

import { ListOrderUseCase } from '../../../src/domain/aggregates/order/usecases/listOrder/ListOrder';
import { OrderGatewayInterface } from '../../../src/domain/aggregates/order/interfaces/gateways/OrderGatewayInterface';

Given(
  'Inicio a listagem de pedidos sem passar o id',
  async function (this: any) {
    const orderGatewayMock: OrderGatewayInterface = {
      getOrders: sinon.stub().resolves([]),
      newOrder: sinon.stub(),
      updateOrderStatus: sinon.stub(),
      insertOrderItems: sinon.stub(),
      beginTransaction: sinon.stub(),
      commit: sinon.stub(),
      rollback: sinon.stub(),
      getItemPrices: sinon.stub(),
    };

    this.result = await ListOrderUseCase.execute({}, orderGatewayMock);
  },
);

Then(
  'Deve retornar erro e message {string}',
  async function (this: any, s: string) {
    assert.equal(this.result.hasError, true);
    assert.equal(this.result.message, s);
  },
);
