import ButtonPrimary from '~/components/Button/ButtonPrimary';
import {
  type CustomerDetailsFragment,
  type OrderCardFragment,
} from 'customer-accountapi.generated';
import { OrderCard } from '~/components/OrderCard';
import { usePrefixPathWithLocale } from '~/lib/utils';
import { flattenConnection } from '@shopify/hydrogen';
import { useAccoutRootLoaderData } from '~/lib/account-data';
import { PageAccoutLayout } from '~/components/PageAccountLayout';

const Page = () => {
  const data = useAccoutRootLoaderData();
  const customer: CustomerDetailsFragment = data.customer;
  const orders = flattenConnection(customer.orders);

  return (
    <PageAccoutLayout breadcrumbText="Order history">
      <section aria-labelledby="order-history-section">
        <h2 id="order-history-section" className="sr-only">
          Order History
        </h2>
        <div className="grid w-full gap-4 md:gap-8">
          {orders?.length ? <Orders orders={orders} /> : <EmptyOrders />}
        </div>
      </section>
    </PageAccoutLayout>
  );
};

type OrderCardsProps = {
  orders: OrderCardFragment[];
};

function EmptyOrders() {
  return (
    <div aria-labelledby="empty-orders-section">
      <h3 id="empty-orders-section" className="text-xl font-semibold">
        No Orders Found
      </h3>
      <p className="mt-2">You haven&apos;t placed any orders yet.</p>
      <div className="mt-5">
        <ButtonPrimary
          href={usePrefixPathWithLocale('/')}
          aria-label="Start shopping and place your first order"
        >
          Start Shopping
        </ButtonPrimary>
      </div>
    </div>
  );
}

function Orders({ orders }: OrderCardsProps) {
  return (
    <section aria-labelledby="orders-section" className="mt-6">
      <h3 id="orders-section" className="text-xl font-semibold">
        Your Orders
      </h3>
      <div className="grid grid-flow-row grid-cols-1 gap-2 gap-y-6 md:gap-4 lg:gap-6 sm:grid-cols-2">
        {orders.map((order) => (
          <OrderCard
            order={order}
            key={order.id}
            aria-labelledby={`order-card-${order.id}`}
          />
        ))}
      </div>
    </section>
  );
}

export default Page;
