import React, { useEffect, useRef } from 'react';

import 'fomantic-ui-css/components/accordion';
import 'fomantic-ui-css/components/accordion.min.css';

import cx from 'classnames';

type AccordionItemId = number;

interface AccordionContextValue {
  toggle: (id: AccordionItemId) => void;
  isActive: (id: AccordionItemId, active: boolean | undefined) => boolean;
}

const AccordionContext = React.createContext<AccordionContextValue | undefined>(
  undefined,
);

type AccordionProps = React.PropsWithChildren<{
  controlled?: boolean;
  className?: string;
  defaultActiveIndexes?: number[];
}>;

const Accordion: React.FC<AccordionProps> = ({
  controlled,
  className,
  defaultActiveIndexes = [],
  children,
}) => {
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Init/destroy Fomantic accordion
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const settings: SemanticUI.AccordionSettings | undefined = {
      on: 'disabled', // We control the open state logic in React
    };

    $(el).accordion(settings);

    if (defaultActiveIndexes?.length) {
      for (const index of defaultActiveIndexes) {
        $(el).accordion('open', index);
      }
    }

    return () => {
      try {
        $(el).accordion('destroy');
      } catch {
        // ignore
      }
    };
  }, []);

  const [activeChildren, setActiveChildren] =
    React.useState<AccordionItemId[]>(defaultActiveIndexes);
  const classNames = cx('ui accordion', className);

  return (
    <div ref={rootRef} className={classNames}>
      <AccordionContext.Provider
        value={{
          toggle: (id) => {
            if (controlled) return;

            if (!rootRef.current) return;
            $(rootRef.current).accordion('toggle', id);

            setActiveChildren((prev) =>
              prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
            );
          },
          isActive: (id, active) => {
            if (controlled) return active!;
            return activeChildren.includes(id);
          },
        }}
      >
        {children}
      </AccordionContext.Provider>
    </div>
  );
};

const toAccordionTitleId = (id: string | undefined) => (id ? `${id}` : undefined);
const toAccordionContentId = (id: string | undefined) =>
  id ? `${id}_content` : undefined;

type AccordionTitleProps = React.PropsWithChildren<{
  active?: boolean;
  index?: number;
}> &
  React.HTMLProps<HTMLDivElement>;

export const AccordionTitle: React.FC<AccordionTitleProps> = ({
  active,
  className,
  children,
  id,
  index = 0,
  ...other
}) => {
  const classNames = cx('title', { active }, className);
  const { isActive, toggle } = React.useContext(AccordionContext)!;
  const contentActive = isActive(index, active);

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    // Toggle on Space, prevent page scroll
    if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'Space') {
      e.preventDefault();
      toggle(index);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      id={toAccordionTitleId(id)}
      aria-expanded={contentActive}
      className={classNames}
      onClick={() => toggle(index)}
      onKeyDown={onKeyDown}
      {...other}
    >
      {children}
    </div>
  );
};

export type AccordionContentProps = React.PropsWithChildren<{
  active?: boolean;
  index?: number;
}> &
  React.HTMLProps<HTMLDivElement>;

export const AccordionContent: React.FC<AccordionContentProps> = ({
  active,
  className,
  children,
  id,
  index = 0,
  ...other
}) => {
  const classNames = cx('content', { active }, className);
  const { isActive } = React.useContext(AccordionContext)!;
  const contentActive = isActive(index, active);
  return (
    <div
      className={classNames}
      id={toAccordionContentId(id)}
      aria-labelledby={toAccordionTitleId(id)}
      role="region"
      aria-hidden={!contentActive}
      {...other}
    >
      {children}
    </div>
  );
};

export default Accordion;
