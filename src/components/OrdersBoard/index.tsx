import { useState } from 'react';
import { OrderModal } from '../OrderModal';
import { Order } from '../../types/Order';
import { toast } from 'react-toastify';

import {
 Board,
 OrdersContainer
 } from './styles';
import { api } from '../../services/api';

 interface Props {
  icon: string;
  title: string;
  orders: Order[];
  onCancelOrder: (orderId: string) => void;
  onChangeOrderStatus: (orderId: string, status: Order['status']) => void;
 }

export function OrdersBoard({icon, title, orders, onCancelOrder, onChangeOrderStatus } :Props){
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedOrder, setselectedOrder] = useState<null | Order>(null)
  const [isLoading, setIsLoading] = useState(false)

  function handleOpenModal(order:Order){
    setIsModalVisible(true)
    setselectedOrder(order)
  }

  function handleCloseModal(){
    setIsModalVisible(false)
    setselectedOrder(null)
  }

  async function handleChangeOrderStatus() {
    setIsLoading(true);

    const status = selectedOrder?.status === 'WAITING'
    ? 'IN_PRODUCTION'
    : 'DONE';
    await api.patch(`/orders/${selectedOrder?._id}`, {status});

    toast.success(`O pedido da mesa ${selectedOrder?.table} teve o status alterado!`);

    onChangeOrderStatus(selectedOrder!._id, status)
    setIsLoading(false)
    setIsModalVisible(false)
  }

  async function handleCancelOrder(){
    setIsLoading(true)

    // await new Promise((resolve, reject) => setTimeout(resolve, 3000));

    await api.delete(`/orders/${selectedOrder?._id}`)

    toast.success(`O pedido da mesa ${selectedOrder?.table} foi cancelado!`);

    onCancelOrder(selectedOrder!._id)
    setIsLoading(false)
    setIsModalVisible(false)
  }

return (
      <Board>
        <OrderModal
          visible={isModalVisible}
          order={selectedOrder}
          onClose={handleCloseModal}
          onCancelOrder={handleCancelOrder}
          isLoading={isLoading}
          onChangeOrderStatus={handleChangeOrderStatus}
        />
              <header>
                <span>{icon}</span>
                <strong>{title}</strong>
                <span>({orders.length})</span>
              </header>

          {orders.length > 0 && (
             <OrdersContainer>
             {
               orders.map((order) => (
                  <button type='button' key={order._id} onClick={() => handleOpenModal(order)}>
                   <strong>Mesa {order.table}</strong>
                   <span>{order.products.length} Itens</span>
                 </button>
               ))
             }
            </OrdersContainer>
          ) }
      </Board>
    );
}
