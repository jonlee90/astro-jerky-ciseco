import React, {type FC} from 'react';
import {Link} from './Link';

interface Props {
  title: string;
  description?: string;
  heading?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  hasBreadcrumb?: boolean;
  breadcrumbText?: string;
  reverseBreadcrumb?: boolean;
  className?: string;
  prevbreadcrumb?: {
    title: string;
    href: string;
  };
}

const PageHeader: FC<Props> = ({
  title,
  description,
  heading: Heading = 'h1',
  hasBreadcrumb = true,
  breadcrumbText = 'Shopping Cart',
  reverseBreadcrumb = false,
  className = '',
  prevbreadcrumb = {
    title: 'Home',
    href: '/',
  },
}) => {
  const renderBreadcrumb = () => {
    if (!hasBreadcrumb) {
      return null;
    }
    return (
      <div
        className={`block text-sm sm:text-base font-medium text-slate-700 dark:text-slate-400 ${
          reverseBreadcrumb ? 'mb-3' : 'mt-3 lg:mt-5'
        }`}
      >
        <Link
          to={prevbreadcrumb.href}
          className="hover:text-slate-900 hover:underline"
        >
          {prevbreadcrumb.title}
        </Link>
        <span className="text-sm mx-1 sm:mx-1.5">/</span>
        {!!breadcrumbText && (
          <span className="underline">{breadcrumbText}</span>
        )}
      </div>
    );
  };

  return (
    <div className={className}>
      {reverseBreadcrumb && renderBreadcrumb()}
      <Heading className="block text-3xl md:text-4xl font-semibold capitalize">
        {title}
      </Heading>
      {!reverseBreadcrumb && renderBreadcrumb()}
      {!!description && (
        <span className="block mt-4 text-lg">
          {description}
        </span>
      )}
    </div>
  );
};

export default PageHeader;
