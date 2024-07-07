import PageHeader from './PageHeader';

export function PageAccoutLayout({
  children,
  breadcrumbText,
}: {
  children: React.ReactNode;
  breadcrumbText: string;
}) {
  return (
    <div className={`py-10 lg:pb-28 lg:pt-20`}>
      <div className="container space-y-24 lg:space-y-32">
        <div className="max-w-screen-lg mx-auto space-y-10 lg:space-y-16">
          <PageHeader
            title={breadcrumbText}
            hasBreadcrumb={true}
            breadcrumbText={breadcrumbText}
            prevbreadcrumb={{
              title: 'Account',
              href: '/account',
            }}
          />
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
