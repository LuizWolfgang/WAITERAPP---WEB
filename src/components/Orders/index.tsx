import React, { useEffect, useState } from 'react';
import socketIo from 'socket.io-client';
import {
 Container,
 } from './styles';

import { OrdersBoard } from '../OrdersBoard';
import { Order } from '../../types/Order';
import { api } from '../../services/api';

// const orders: Order[] = [
//   {
//     _id: '6372e48cbcd195b0d3d0f7f3',
//     table: '123',
//     status: 'WAITING',
//     products: [
//       {
//         product: {
//           name: 'Pizza quatro queijos',
//           imagePath: pizza,
//           price: 40,
//         },
//         quantity: 3,
//         _id: '6372e48cbcd195b0d3d0f7f4'
//       },
//       {
//         product: {
//           name: 'Coca cola',
//           imagePath: coca,
//           price: 7,
//         },
//         quantity: 2,
//         _id: '6372e48cbcd195b0d3d0f7f5'
//       },
//     ],
//   }
// ];

export function Orders(){
  const [orders, setOrders] = useState<Order[]>([]);

  //web socket
  useEffect(() => {
    const socket = socketIo('http://localhost:3000', {
      transports: ['websocket'],
    });

    socket.on('order@new', (order) => {
      setOrders((prevState) => prevState.concat(order));
    })

  },[]);

  useEffect(() => {
    api.get('/orders')
    .then(({ data }) => {
      setOrders(data)
    });
  }, []);

  const waiting = orders.filter((order) => order.status === 'WAITING');
  const inProduction = orders.filter((order) => order.status === 'IN_PRODUCTION');
  const done = orders.filter((order) => order.status === 'DONE');

  function handleCancelOrder(orderId: string) {
    // mantendo na lista apenas os pedidos que tem o id diferente do que acabou de ser deletado
    setOrders((prevState) => prevState.filter(order => order._id !== orderId));
    // prevState => toda minha lista
  }

  function handleOrderStatusChange(orderId: string, status: Order['status']) {
    //alterando o status do pedido
    setOrders((prevState) => prevState.map((order) => (
      order._id === orderId
      ? { ...order, status}
      : order
    )));
  }

return (
     <Container>
       <OrdersBoard
          icon="🕒"
          title="Fila de espera"
          orders={waiting}
          onCancelOrder={handleCancelOrder}
          onChangeOrderStatus={handleOrderStatusChange}
       />
       <OrdersBoard
          icon="👨🏻‍🍳"
          title="Em preparação"
          orders={inProduction}
          onCancelOrder={handleCancelOrder}
          onChangeOrderStatus={handleOrderStatusChange}
       />
       <OrdersBoard
          icon="✅"
          title="Pronto!"
          orders={done}
          onCancelOrder={handleCancelOrder}
          onChangeOrderStatus={handleOrderStatusChange}
       />
     </Container>
    );
}
