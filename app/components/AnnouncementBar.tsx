interface AnnouncementBarProps {
  content: string;
}

export function AnnouncementBar({ content = '' }: AnnouncementBarProps) {
  return (
    <div className="bg-logo-green text-white flex items-center justify-center">
      <p className="uppercase font-bold text-xs tracking-widest text-center px-4 py-3 leading-none">
        {content}
      </p>
    </div>
  );
}
