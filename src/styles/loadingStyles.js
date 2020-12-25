import {StyleSheet, Dimensions} from 'react-native';

const height = Dimensions.get('window').height,
	width = Dimensions.get('window').width;

export default StyleSheet.create({
	container: {
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		flexWrap: 'wrap',
		width: width,
		height: height,
		flex: 1,
	},
	fullBackground: {
		width: width,
		height: height,
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		top: 0,
	},
	loadingLogo: {
		width: width * 0.4,
	},
});
