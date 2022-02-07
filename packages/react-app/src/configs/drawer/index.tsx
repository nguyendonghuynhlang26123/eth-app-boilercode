import { BlockOutlined, HomeOutlined } from '@mui/icons-material';
import { GrSend } from 'react-icons/gr';
import { DrawerItemConfigType } from 'common/type';

export const drawerConfigs: DrawerItemConfigType[] = [
  {
    title: 'Dashboard',
    icon: <HomeOutlined />,
    href: '/',
    type: 'item',
  },
  {
    title: 'Web3 common operations',
    type: 'group',
    children: [
      {
        title: 'Transfer assets',
        icon: <GrSend size={20} />,
        href: '/common/transfer',
        type: 'item',
      },
      {
        title: 'Contract',
        icon: <BlockOutlined />,
        href: '/blacklist',
        type: 'item',
      },
    ],
  },
];
