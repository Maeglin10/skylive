import { clsx } from 'clsx';

/**
 * Skeleton component for loading states
 * @param className - Additional CSS classes to apply
 * @returns A pulsing skeleton placeholder element with shimmer effect
 */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "animate-pulse rounded-md bg-white/5 bg-gradient-to-r from-transparent via-white/5 to-transparent bg-[length:200%_100%] animate-shimmer",
        className
      )}
      {...props}
    />
  );
}
