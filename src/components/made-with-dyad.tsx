import { cn } from '@/lib/utils';

const linkClassName = cn(
  'text-sm text-boteco-primary-foreground/80',
  'transition-colors hover:text-boteco-secondary-foreground',
  'focus-visible:outline-none focus-visible:ring-2',
  'focus-visible:ring-boteco-secondary focus-visible:ring-offset-2',
  'focus-visible:ring-offset-boteco-primary'
);

export const MadeWithDyad = () => {
  return (
    <div className="p-4 text-center">
      <a
        href="https://www.dyad.sh/"
        target="_blank"
        rel="noopener noreferrer"
        className={linkClassName}
      >
        Made with Dyad
      </a>
    </div>
  );
};
