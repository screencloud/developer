import React from 'react';
import config from '../../../config';
import ClosedSvg from '../../images/closed';
import OpenedSvg from '../../images/opened';
import Link from '../link';
import type { TreeItem } from './tree';

interface TreeNodeProps {
  className?: string;
  setCollapsed: (url: string) => void;
  collapsed: Record<string, boolean>;
  url?: string;
  title?: string;
  label?: string;
  items: TreeItem[];
}

const TreeNode = ({
  className = '',
  setCollapsed,
  collapsed,
  url,
  title,
  items,
}: TreeNodeProps) => {
  const isCollapsed = url ? collapsed[url] : false;

  const collapse = () => {
    if (url) {
      setCollapsed(url);
    }
  };

  const hasChildren = items.length !== 0;

  let location: typeof document.location | undefined;

  if (typeof document != 'undefined') {
    location = document.location;
  }
  const active =
    location && (location.pathname === url || location.pathname === config.gatsby.pathPrefix + url);

  const calculatedClassName = `${className} item ${active ? 'active' : ''}`;

  return (
    <li className={calculatedClassName}>
      {title && url && (
        <Link to={url}>
          {title}
          {!config.sidebar.frontline && title && hasChildren ? (
            <button onClick={collapse} aria-label="collapse" className="collapser">
              {!isCollapsed ? <OpenedSvg /> : <ClosedSvg />}
            </button>
          ) : null}
        </Link>
      )}

      {!isCollapsed && hasChildren ? (
        <ul>
          {items.map((item, index) => (
            <TreeNode
              key={(item.url || '') + index.toString()}
              setCollapsed={setCollapsed}
              collapsed={collapsed}
              {...item}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
};

export default TreeNode;
