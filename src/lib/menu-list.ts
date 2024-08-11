import { Tag, Bookmark, SquarePen, LayoutGrid } from 'lucide-react';

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: any;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: 'Contents',
      menus: [
        {
          href: '',
          label: 'Campaigns',
          active: pathname.includes('/campaigns'),
          icon: SquarePen,
          submenus: [
            {
              href: '/dashboard/campaigns',
              label: 'Your Campaigns',
              active: pathname === '/dashboard/campaigns',
            },
            {
              href: '/dashboard/campaigns/new',
              label: 'Create Campaign',
              active: pathname === '/dashboard/campaigns/new',
            },
          ],
        },
      ],
    },
  ];
}
