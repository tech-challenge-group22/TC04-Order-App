@listOrder
Feature: Deve listar os pedidos

    @listarTodosPedidos
    Scenario: Deve listar todos os pedidos
        Given Inicio a listagem de pedidos sem passar o id
        Then Deve retornar erro e message 'Ops, No Orders found. Something went wrong... :('