import React from 'react';

// React-Navigation dependencies
import {NavigationContainer} from '@react-navigation/native';
import {StatusBar} from 'react-native';
// import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

// Bottom Tab Bar Components
import Icon from './icon';
import TabBar from './tabbar';

// Screens
import Home from '../screens/Home';
import PrayerRequests from '../screens/PrayerRequests';
import Bible from '../screens/Bible';
import Groups from '../screens/Groups';
import Account from '../screens/Account';
// import Deals from '../screens/Deals';
// import Menu from '../screens/Menu';
// import Cart from '../screens/Cart';
// import Checkout from '../screens/Checkout';
// import Account from '../screens/Account';
// import UserOrders from '../screens/UserOrders';

// const CartStack = createStackNavigator();

// function CartStackScreen() {
// 	return (
// 		<CartStack.Navigator headerMode="none" mode="modal">
// 			<CartStack.Screen name="Cart" component={Cart} />
// 			<CartStack.Screen name="Checkout" component={Checkout} />
// 		</CartStack.Navigator>
// 	);
// }

// const AccountStack = createStackNavigator();

// function AccountStackScreen() {
// 	return (
// 		<AccountStack.Navigator headerMode="none" mode="modal">
// 			<AccountStack.Screen name="Account" component={Account} />
// 			<AccountStack.Screen name="UserOrders" component={UserOrders} />
// 		</AccountStack.Navigator>
// 	);
// }

const Tab = createBottomTabNavigator();

export default function App(props) {
	console.log('route',props);
	return (
		<NavigationContainer>
			<StatusBar barStyle="light-content" backgroundColor="#EB237D"/>
			<Tab.Navigator
				screenOptions={({route}) => ({
					tabBarIcon: ({tintColor}) => {
						return <Icon name={route} color={tintColor} />;
					},
				})}
				tabBar={(props) => <TabBar {...props} />}
				tabBarOptions={{
					activeTintColor: '#FFFFFF',
					inactiveTintColor: '#d9d9d9',
					showLabel: false,
				}}>
				<Tab.Screen name="Home" component={Home} />
				<Tab.Screen name="PrayerRequests" component={PrayerRequests} />
				<Tab.Screen name="Bible" component={Bible} />
				<Tab.Screen name="Groups" component={Groups} />
				<Tab.Screen name="Account" component={Account} />
			</Tab.Navigator>
		</NavigationContainer>
	);
}
