import ButtonPrimary from '~/components/Button/ButtonPrimary';
import { PencilIcon } from '@heroicons/react/24/outline';
import { type CustomerDetailsFragment } from 'customer-accountapi.generated';
import { useAccoutRootLoaderData } from '~/lib/account-data';
import { PageAccoutLayout } from '~/components/PageAccountLayout';

const Page = () => {
  const data = useAccoutRootLoaderData();
  const { firstName, lastName, emailAddress, phoneNumber } =
    data.customer as CustomerDetailsFragment;

  return (
    <PageAccoutLayout breadcrumbText="Personal info">
      <section aria-labelledby="personal-info-section" className="mt-6 border-t border-gray-100">
        <h2 id="personal-info-section" className="sr-only">
          Personal Information
        </h2>
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              First name
            </dt>
            <dd
              className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0"
              aria-label="First name"
            >
              {firstName || 'No first name provided'}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Last name
            </dt>
            <dd
              className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0"
              aria-label="Last name"
            >
              {lastName || 'No last name provided'}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Phone number
            </dt>
            <dd
              className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0"
              aria-label="Phone number"
            >
              {phoneNumber?.phoneNumber ?? 'No phone number provided'}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Email address
            </dt>
            <dd
              className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0"
              aria-label="Email address"
            >
              {emailAddress?.emailAddress ?? 'No email address provided'}
            </dd>
          </div>
        </dl>
      </section>

      <div className="flex mt-6">
        <ButtonPrimary
          href="/account/edit"
          aria-label="Edit personal information"
        >
          <PencilIcon
            className="w-4 h-4 me-2"
            role="img"
            aria-label="Edit icon"
          />
          Edit personal info
        </ButtonPrimary>
      </div>
    </PageAccoutLayout>
  );
};

export default Page;
