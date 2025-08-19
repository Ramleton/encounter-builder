import { AccountCircle, Ballot, ListAlt, Settings } from '@mui/icons-material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu';
import { Avatar, Button, Typography } from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { CSSObject, styled, Theme, useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
	width: drawerWidth,
	transition: theme.transitions.create('width', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen,
	}),
	overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
	transition: theme.transitions.create('width', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	overflowX: 'hidden',
	width: `calc(${theme.spacing(7)} + 1px)`,
	[theme.breakpoints.up('sm')]: {
		width: `calc(${theme.spacing(8)} + 1px)`,
	},
});

const DrawerHeader = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'flex-end',
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  	open?: boolean;
}

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(['width', 'margin'], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	variants: [
		{
		props: ({ open }) => open,
		style: {
			marginLeft: drawerWidth,
			width: `calc(100% - ${drawerWidth}px)`,
			transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
			}),
		},
		},
	],
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
	({ theme }) => ({
		width: drawerWidth,
		flexShrink: 0,
		whiteSpace: 'nowrap',
		boxSizing: 'border-box',
		variants: [
		{
			props: ({ open }) => open,
			style: {
			...openedMixin(theme),
			'& .MuiDrawer-paper': openedMixin(theme),
			},
		},
		{
			props: ({ open }) => !open,
			style: {
			...closedMixin(theme),
			'& .MuiDrawer-paper': closedMixin(theme),
			},
		},
		],
	}),
);

interface MainLayoutProps {
	children: React.ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
	const [open, setOpen] = React.useState(false);
	const theme = useTheme();
	const navigate = useNavigate();

	const {
		user,
		isAuthenticated,
	} = useAuth();


	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};

	return (
		<Box sx={{ display: 'flex' }}>
		<CssBaseline />
		<AppBar position="fixed" open={open}>
			<Toolbar>
			<IconButton
				color="inherit"
				aria-label="open drawer"
				onClick={handleDrawerOpen}
				edge="start"
				sx={[
				{
					marginRight: 5,
				},
				open && { display: 'none' },
				]}
			>
				<MenuIcon />
			</IconButton>
			<Button variant="text" onClick={() => navigate("")}>
				<Typography variant="h6" sx={{ color: theme.palette.secondary.main, border: "none" }}>
					EncounterArchitect
				</Typography>
			</Button>
			</Toolbar>
		</AppBar>
		<Drawer variant="permanent" open={open}>
			<DrawerHeader>
			<IconButton onClick={handleDrawerClose}>
				{theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
			</IconButton>
			</DrawerHeader>
			{/* Start of section 1 */}
			<Box sx={{
			display: "flex",
			flexDirection: "column",
			justifyContent: "space-between",
			height: "100%"
			}}>
			<Box>
				<Divider />
				<List>
					<ListItem disablePadding sx={{ display: 'block' }}>
						<ListItemButton
							onClick={() => {
								if (!isAuthenticated) return navigate("/auth");
								navigate("/statblocks/search");
							}}
							sx={[
							{
								minHeight: 48,
								px: 2.5,
							},
							open
								? { justifyContent: 'initial' }
								: { justifyContent: 'center' },
							]}
						>
							<ListItemIcon
							sx={[
								{
								minWidth: 0,
								justifyContent: 'center',
								},
								open
								? {
									mr: 3,
									}
								: {
									mr: 'auto',
									},
							]}
							>
								<ListAlt sx={{ width: 32, height: 32 }} />
							</ListItemIcon>
							<ListItemText
								primary="StatBlocks"
								sx={[
									open
									? {
										opacity: 1,
										}
									: {
										opacity: 0,
										},
								]}
							/>
						</ListItemButton>
					</ListItem>
					<ListItem disablePadding sx={{ display: 'block' }}>
						<ListItemButton
							onClick={() => {
								if (!isAuthenticated) return navigate("/auth");
								navigate("/encounters/search");
							}}
							sx={[
							{
								minHeight: 48,
								px: 2.5,
							},
							open
								? {
									justifyContent: 'initial',
								}
								: {
									justifyContent: 'center',
								},
							]}
						>
							<ListItemIcon
							sx={[
								{
								minWidth: 0,
								justifyContent: 'center',
								},
								open
								? {
									mr: 3,
									}
								: {
									mr: 'auto',
									},
							]}
							>
								<Ballot sx={{ width: 32, height: 32 }} />
							</ListItemIcon>
							<ListItemText
							primary="Encounters"
							sx={[
								open
								? {
									opacity: 1,
								}
								: {
									opacity: 0,
								},
							]}
							/>
						</ListItemButton>
					</ListItem>
				</List>
				<Divider />
			</Box>
			<Box>
				<Divider />
				<List>
				{['Account', 'Settings'].map((text, index) => (
					<ListItem key={text} disablePadding sx={{ display: 'block' }}>
					<ListItemButton
						sx={[
						{
							minHeight: 48,
							px: 2.5,
						},
						open
							? {
								justifyContent: 'initial',
							}
							: {
								justifyContent: 'center',
							},
						]}
					>
						<ListItemIcon
						sx={{
							minWidth: 0,
							justifyContent: 'center',
							alignItems: 'center',
							display: 'flex',
							mr: open ? 3 : 0
						}}
						>
						{index % 2 === 0 ? (
							isAuthenticated && user?.avatarUrl
							?
								<Avatar
									alt={user.username}
									src={user.avatarUrl}
									sx={{ width: 32, height: 32 }}
								/>
							: <AccountCircle sx={{ width: 32, height: 32 }} />
							) : <Settings sx={{ width: 32, height: 32 }} />}
						</ListItemIcon>
						<ListItemText
						primary={text}
						sx={[
							open
							? {
								opacity: 1,
								}
							: {
								opacity: 0,
								},
						]}
						/>
					</ListItemButton>
					</ListItem>
				))}
				</List>
			</Box>
			</Box>
		</Drawer>
		<Box component="main" sx={{ flexGrow: 1, p: 3 }}>
			<DrawerHeader />
				{children}
		</Box>
		</Box>
	);
}

export default MainLayout;
