import React, {type FC} from 'react';

export interface SocialsListProps {
  className?: string;
  itemClass?: string;
  data?: {
    name: string;
    icon: string;
    href: string;
  }[];
}

const SocialsList: FC<SocialsListProps> = ({
  className = '',
  itemClass = 'block w-6 h-6',
  data = [],
}) => {
  return (
    <div
      className={`nc-SocialsList flex flex-wrap gap-5 text-2xl text-neutral-600 ${className}`}
      aria-label='Footer Social Media links'
    >
      {data.map((item, i) => (
        <a
          key={`${i + item.name}`}
          className={`${itemClass}`}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          title={item.name}
          aria-label={`Follow us on ${item.name}`}
        >
          <span className="sr-only">{item.name}</span>
          {item.icon ? (
            <img
              className="size-10"
              src={item.icon}
              alt={item.name}
            />
          ) : (
            <div className="w-full h-full bg-slate-200 rounded-full"></div>
          )}
        </a>
      ))}
    </div>
  );
};

export default SocialsList;
