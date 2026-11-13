import React from 'react';
import { useNews } from '../../context/NewsContext';
import type { ViewState } from '../../types';
import { pathFromView } from '../../utils/routes';

interface AppLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  view: ViewState;
}

/** Real href for every page, with in-app navigation (open-in-new-tab still works). */
export const AppLink: React.FC<AppLinkProps> = ({ view, onClick, children, ...rest }) => {
  const { setView } = useNews();
  const href = pathFromView(view);

  return (
    <a
      href={href}
      {...rest}
      onClick={event => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
          return;
        }
        event.preventDefault();
        setView(view);
      }}
    >
      {children}
    </a>
  );
};
