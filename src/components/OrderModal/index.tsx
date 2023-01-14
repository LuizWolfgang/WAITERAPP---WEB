import { useEffect } from 'react';
import iconClose from '../../assets/images/close-icon.svg';
import { Order } from '../../types/Order';

import {
  ModalBody,
  Overley,
  OrderDetails,
  Actions
 } from './styles';

interface OrderModalProps {
  visible: Boolean;
  order: Order | null;
  onClose(): void;
  onCancelOrder: () => Promise<void>;
  isLoading: Boolean;
  onChangeOrderStatus: () => Promise<void>;
}

export function OrderModal({ visible, order, onClose, onCancelOrder, isLoading, onChangeOrderStatus }: OrderModalProps) {

  useEffect(() => {
   document.addEventListener('keydown', (event) => {
    if(event.key === 'Esc') {
      onClose();
    }
   })
  })

  if(!visible || !order) {
    return null;
  }

  const total = order.products.reduce((total, {product, quantity}) => {
    return total + (product.price * quantity)
  }, 0)

  return (
    <Overley>
      <ModalBody>
        <header>
          <strong>Mesa {order.table}</strong>
          <button type="button" onClick={onClose}>
            <img src={iconClose} alt="Icone de fechar"/>
          </button>
        </header>
        <div className="status-container">
            <small>Status do Pedido</small>
            <div>
              <span>
                {order.status === 'WAITING' && '🕒'}
                {order.status === 'IN_PRODUCTION' && '👨🏻‍🍳'}
                {order.status === 'DONE' && '✅'}
              </span>
              <strong>
                {order.status === 'WAITING' && 'Fila de espera'}
                {order.status === 'IN_PRODUCTION' && 'Em preparação'}
                {order.status === 'DONE' && 'Pronto'}
              </strong>
            </div>
          </div>
          <OrderDetails>
            <strong>Itens</strong>

            <div className="order-itens">
               {order.products.map(({_id, product, quantity}) => (
                <div className="item" key={_id}>

                  <img src={`http://localhost:3000/uploads/${product.imagePath}`}
                    alt={product.name}
                    width="48"
                    height="24.43"
                  />

                  <span className="quantity">{quantity}x</span>

                  <div className="products-details">
                      <strong>{product.name}</strong>
                      <span>R$ {product.price}</span>
                  </div>

                </div>
               ))
              }
            </div>
            <div className="total">
              <span>Total</span>
              <strong>R$ {total}</strong>
            </div>
          </OrderDetails>

          <Actions>
            {order.status !== 'DONE' && (
               <button
               type="button"
               className="primary"
               disabled={isLoading}
               onClick={onChangeOrderStatus}
               >
              <span>
                { order.status === 'WAITING' && ' 👨🏻‍🍳' }
                { order.status === 'IN_PRODUCTION' && ' ✅' }
              </span>
                <strong>
                { order.status === 'WAITING' && 'Iniciar Produção' }
                { order.status === 'IN_PRODUCTION' && 'Concluir Pedido' }
                </strong>
              </button>
            )}

              <button
                type="button"
                className="secondary"
                onClick={onCancelOrder}
                disabled={isLoading}
              >
                <strong>Cancelar Pedido</strong>
              </button>
          </Actions>
      </ModalBody>
    </Overley>
  );
}
