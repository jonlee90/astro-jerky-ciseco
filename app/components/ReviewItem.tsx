import {StarIcon} from '@heroicons/react/24/solid';
import React, {type FC} from 'react';
import Avatar from './Avatar';

interface ReviewItemDataType {
  name: string;
  avatarSrc?: string;
  date: string;
  comment: string;
  starPoint: number;
}

export interface ReviewItemProps {
  className?: string;
  data?: ReviewItemDataType;
}

const DEMO_DATA: ReviewItemDataType = {
  name: 'Cody Fisher',
  date: 'May 20, 2021',
  comment:
    'Very nice feeling sweater. I like it better than a regular hoody because it is tailored to be a slimmer fit. Perfect for going out when you want to stay comfy. The head opening is a little tight which makes it a little.',
  starPoint: 5,
};

const ReviewItem: FC<ReviewItemProps> = ({
  className = '',
  data = DEMO_DATA,
}) => {
  return (
    <div
      className={`nc-ReviewItem flex flex-col ${className}`}
      data-nc-id="ReviewItem"
    >
      <div className=" flex gap-3.5">
        <div className="flex-shrink-0 pt-0.5">
          <Avatar
            sizeClass="h-11 w-11 text-lg"
            radius="rounded-full"
            userName={data.name}
            imgUrl={data.avatarSrc}
          />
        </div>

        <div className="flex-1 flex justify-between">
          <div className="text-base sm:text-lg">
            <span className="block font-semibold">{data.name}</span>
            <span className="block mt-0.5 text-slate-500 dark:text-slate-400 text-base">
              {data.date}
            </span>
          </div>

          <div className="mt-0.5 flex text-yellow-500">
            <StarIcon className="w-5 h-5" />
            <StarIcon className="w-5 h-5" />
            <StarIcon className="w-5 h-5" />
            <StarIcon className="w-5 h-5" />
            <StarIcon className="w-5 h-5" />
          </div>
        </div>
      </div>
      <div className="mt-4 prose prose-sm sm:prose dark:prose-invert sm:max-w-2xl">
        <p className="text-slate-600 dark:text-slate-300">{data.comment}</p>
      </div>
    </div>
  );
};

export default ReviewItem;
