'use client';

import React from 'react';

export interface CopyTextProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  text: string;
}

export const CopyText = ({
  className,
  children,
  text,
  ...props
}: CopyTextProps) => {
  function copyToClipboard() {
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = text;

    document.body.appendChild(tempTextArea);

    tempTextArea.select();
    tempTextArea.setSelectionRange(0, 99999);

    document.execCommand('copy');

    document.body.removeChild(tempTextArea);
  }

  return (
    <div {...props} onClick={copyToClipboard} className={className}>
      {children}
    </div>
  );
};
