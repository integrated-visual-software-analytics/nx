import { ChevronDoubleDownIcon } from '@heroicons/react/24/outline';
import cx from 'classnames';
import { ReactNode, createContext, useState } from 'react';
import { computeEmbedURL } from './youtube.component';

const FlipCardContext = createContext<{
  fullDate: string;
  onClick?: () => void;
}>({
  fullDate: '',
  onClick: () => {},
});

export function FlipCard({
  isFlippable,
  isFlipped,
  day,
  fullDate,
  onFlip,
  onClick,
  children,
}: {
  isFlippable?: boolean;
  isFlipped?: boolean;
  onFlip?: (day: number, isFlipped: boolean) => void;
  day: number;
  fullDate?: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  const [flipped, setFlipped] = useState(() => isFlipped);

  return (
    <FlipCardContext.Provider value={{ fullDate: fullDate || '', onClick }}>
      <span
        onClick={(event) => {
          if (isFlippable && !flipped) {
            setFlipped(true);
            onFlip && onFlip(day, true);
            event.preventDefault();
          } else {
            onClick && onClick();
          }
        }}
        className={cx(
          'block group perspective',
          isFlippable && !flipped ? 'cursor-pointer' : 'cursor-default'
        )}
      >
        <div
          className={cx(
            'relative preserve-3d transition w-full h-full duration-200 content-center rounded-lg border-2 shadow-sm focus-within:ring-offset-2 bg-white/60 dark:bg-slate-800/80',
            flipped ? 'my-rotate-y-180 bg-white dark:bg-slate-800' : '',
            isFlippable
              ? flipped
                ? 'border-slate-300 dark:border-slate-800'
                : 'border-slate-300 dark:border-slate-800 hover:[transform:rotateY(10deg)]'
              : 'border-1 border-slate-300 dark:border-slate-800'
          )}
        >
          <FlipCardFront>{fullDate}</FlipCardFront>
          {children}
        </div>
      </span>
    </FlipCardContext.Provider>
  );
}

export function FlipCardFront({ children }: { children: ReactNode }) {
  return (
    <div className="absolute backface-hidden w-full h-full flex flex-col justify-center items-center text-center text-3xl px-2">
      {children}
    </div>
  );
}

export function FlipCardBack({ children }: { children: ReactNode }) {
  return (
    <FlipCardContext.Consumer>
      {({ fullDate }) => (
        <div className="my-rotate-y-180 backface-hidden w-full h-full overflow-hidden rounded-md dark:text-slate-100 text-slate-900 text-3xl dark:bg-slate-800 bg-white">
          <span className="absolute top-0 left-0 pt-5 pl-4 text-sm">
            {fullDate}
          </span>
          <div className="p-4 text-sm sm:text-sm md:text-sm lg:text-lg">
            {children}
          </div>
        </div>
      )}
    </FlipCardContext.Consumer>
  );
}
