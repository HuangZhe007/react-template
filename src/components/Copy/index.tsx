import { useCopyToClipboard } from 'react-use';
import Icon from '@ant-design/icons';
import React from 'react';
import { ReactComponent as CopyIcon } from 'assets/images/copy.svg';
export default function Copy({
  toCopy,
  children,
  className,
}: {
  toCopy: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const [isCopied, setCopied] = useCopyToClipboard();
  return (
    <span onClick={() => setCopied(toCopy)} className={className}>
      {isCopied.value ? (
        'Copied'
      ) : (
        <>
          <Icon component={CopyIcon} />
          {children}
        </>
      )}
    </span>
  );
}
