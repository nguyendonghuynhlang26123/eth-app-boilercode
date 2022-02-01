import { ExitToApp, ExpandMore } from '@mui/icons-material';
import {
  Avatar,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  LinearProgress,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { DrawerItemConfigType } from 'common/type';
import { drawerConfigs } from 'configs';
import { useCopyToClipboard } from 'hooks';
import * as React from 'react';
import { matchPath, useLocation, useNavigate } from 'react-router-dom';
import { navbarLayoutSx } from './style';
import { NavbarProps } from './type';
import EthereumLogo from 'assets/images/ethereumLogo.png';
import Blockies from 'react-blockies';

export const Navbar = ({ children, loading, account, ens, handleDisconnect, handleConnect }: NavbarProps) => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [copiedText, copy] = useCopyToClipboard();

  const handleCopyAccount = (ev: any) => {
    ev.preventDefault();
    if (account) copy(account);
  };

  const DrawerItem = (item: DrawerItemConfigType, isChildren: boolean): JSX.Element => {
    let isActive: boolean = false;
    if (item.href && matchPath(item.href, pathname)) {
      isActive = true;
    }

    if (item.type === 'group')
      return (
        <>
          <ListItem component="div">
            <Accordion sx={navbarLayoutSx.accordionItem} defaultExpanded={true}>
              <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1a-content">
                <Typography sx={navbarLayoutSx.title}>{item.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {item.children?.map((subItem, i) => (
                  <React.Fragment key={i}>{DrawerItem(subItem, true)}</React.Fragment>
                ))}
              </AccordionDetails>
            </Accordion>
          </ListItem>

          <Divider component="li" />
        </>
      );
    else if (item.type === 'item')
      return (
        <>
          <ListItem component="div">
            <ListItemButton sx={navbarLayoutSx.btnItem} onClick={() => navigate(item.href ?? '')} className={isActive ? 'active' : ''}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        </>
      );
    else if (item.type === 'divider') return <Divider component="li" />;
    else return <></>;
  };

  return (
    <React.Fragment>
      <Box sx={navbarLayoutSx.root}>
        <AppBar position="fixed" sx={navbarLayoutSx.appbar} elevation={trigger ? 4 : 0}>
          <Toolbar sx={navbarLayoutSx.toolbar}>
            {!account ? (
              <Button variant="outlined" onClick={handleConnect}>
                Connect Wallet
              </Button>
            ) : (
              <>
                <Typography>
                  <Tooltip title={copiedText ? 'Copied' : 'Copy account'}>
                    <Link underline="hover" color="primary" onClick={handleCopyAccount} href="/">
                      {ens ? ens : account.substring(0, 6) + '...' + account.substring(36)}
                    </Link>
                  </Tooltip>
                </Typography>
                <Avatar>
                  <Blockies seed={account} size={10} scale={4} bgColor="#ffe" className="identicon" />
                </Avatar>
                <IconButton onClick={handleDisconnect}>
                  <Tooltip title="Disconnect">
                    <ExitToApp />
                  </Tooltip>
                </IconButton>
              </>
            )}
          </Toolbar>
          {loading && <LinearProgress />}
        </AppBar>
        <Drawer sx={navbarLayoutSx.drawer} variant="permanent" anchor="left">
          <Toolbar>
            <Avatar alt="project logo" src={EthereumLogo} sx={{ width: 'auto', height: 40 }} />
            <Typography variant="h4" color="primary">
              Eth-project
            </Typography>
          </Toolbar>

          <List>
            {drawerConfigs.map((item, i) => (
              <React.Fragment key={i}> {DrawerItem(item, true)} </React.Fragment>
            ))}
          </List>
        </Drawer>
        <Box component="main" sx={navbarLayoutSx.main}>
          <Container>{children}</Container>
        </Box>
      </Box>
    </React.Fragment>
  );
};
