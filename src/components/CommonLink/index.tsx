import Icon from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import { isUrl } from '../../utils/reg';
import { ReactComponent as LinkIcon } from 'assets/images/link.svg';
import clsx from 'clsx';
import './styles.less';
export default function CommonLink({
  href,
  children,
  className,
}: {
  href: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <Button
      className={clsx('common-link', className)}
      disabled={!href || !isUrl(href)}
      onClick={(e) => e.stopPropagation()}
      target="_blank"
      type="link"
      href={href}>
      <Icon component={LinkIcon} />
      {children}
    </Button>
  );
}
