'use client';

import { useWalletMultiButton } from '@solana/wallet-adapter-base-ui';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { getAccountBalance } from '@/services/web3';
import { SessionContext } from './sessions';

type BaseWalletMultiButtonProps = any & {
  labels: Omit<
    {
      [TButtonState in ReturnType<
        typeof useWalletMultiButton
      >['buttonState']]: string;
    },
    'connected' | 'disconnecting'
  > & {
    'copy-address': string;
    copied: string;
    'change-wallet': string;
    disconnect: string;
  };
};

export function BaseWalletMultiButton({
  children,
  labels,
  ...props
}: BaseWalletMultiButtonProps) {
  const { setVisible: setModalVisible } = useWalletModal();
  const {
    buttonState,
    onConnect,
    onDisconnect,
    publicKey,
    walletIcon,
    walletName,
  } = useWalletMultiButton({
    onSelectWallet() {
      setModalVisible(true);
    },
  });
  const { selectedNetwork } = useContext(SessionContext);
  const [walletBalance, setWalletBalance] = useState(0);
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const node = ref.current;

      // Do nothing if clicking dropdown or its descendants
      if (!node || node.contains(event.target as Node)) return;

      setMenuOpen(false);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, []);
  const content = useMemo(() => {
    if (children) {
      return children;
    } else if (publicKey) {
      const base58 = publicKey.toBase58();
      return base58.slice(0, 4) + '..' + base58.slice(-4);
    } else if (buttonState === 'connecting' || buttonState === 'has-wallet') {
      return labels[buttonState];
    } else {
      return labels['no-wallet'];
    }
  }, [buttonState, children, labels, publicKey]);

  const updateWalletbalance = async () => {
    if (publicKey) {
      const newBalance = await getAccountBalance(publicKey, selectedNetwork);
      setWalletBalance(Number(newBalance.toFixed(3)));
    }
  };
  useEffect(() => {
    updateWalletbalance();
  }, [publicKey, selectedNetwork]);

  return (
    <div className="wallet-adapter-dropdown">
      <button
        {...props}
        className="flex h-9 items-center rounded-full border-[2px] border-black px-4 py-2 shadow-sm dark:border-white"
        aria-expanded={menuOpen}
        style={{ pointerEvents: menuOpen ? 'none' : 'auto', ...props.style }}
        onClick={() => {
          switch (buttonState) {
            case 'no-wallet':
              setModalVisible(true);
              break;
            case 'has-wallet':
              if (onConnect) {
                onConnect();
              }
              break;
            case 'connected':
              setMenuOpen(true);
              break;
          }
        }}
        walletIcon={walletIcon}
        walletName={walletName}
      >
        <span className="flex items-center gap-[5px]">
          {publicKey && <span>{walletBalance} SOL</span>}
          {content}
        </span>
      </button>
      <ul
        aria-label="dropdown-list"
        className={`wallet-adapter-dropdown-list !bg-white dark:!bg-secondary ${menuOpen && 'wallet-adapter-dropdown-list-active'}`}
        ref={ref}
        role="menu"
      >
        {publicKey ? (
          <li
            className="wallet-adapter-dropdown-list-item !text-primary hover:!bg-blue-400  dark:hover:!bg-blue-900"
            onClick={async () => {
              await navigator.clipboard.writeText(publicKey.toBase58());
              setCopied(true);
              setTimeout(() => setCopied(false), 400);
            }}
            role="menuitem"
          >
            {copied ? labels['copied'] : labels['copy-address']}
          </li>
        ) : null}
        <li
          className="wallet-adapter-dropdown-list-item !text-primary hover:!bg-blue-400  dark:hover:!bg-blue-900"
          onClick={() => {
            setModalVisible(true);
            setMenuOpen(false);
          }}
          role="menuitem"
        >
          {labels['change-wallet']}
        </li>
        {onDisconnect ? (
          <li
            className="wallet-adapter-dropdown-list-item !text-primary hover:!bg-blue-400  dark:hover:!bg-blue-900"
            onClick={() => {
              onDisconnect();
              setMenuOpen(false);
            }}
            role="menuitem"
          >
            {labels['disconnect']}
          </li>
        ) : null}
      </ul>
    </div>
  );
}

const LABELS = {
  'change-wallet': 'Change wallet',
  connecting: 'Connecting ...',
  'copy-address': 'Copy address',
  copied: 'Copied',
  disconnect: 'Disconnect',
  'has-wallet': 'Connect',
  'no-wallet': 'Connect Wallet',
} as const;

export function WalletConnectButton() {
  return <BaseWalletMultiButton labels={LABELS} />;
}
