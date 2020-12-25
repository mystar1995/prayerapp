import {StyleSheet, Dimensions} from 'react-native';

const height = Dimensions.get('window').height,
	width = Dimensions.get('window').width;

export default StyleSheet.create({
	loaderContainer: {
		width: width,
		height: height,
		position: 'absolute',
		backgroundColor: 'rgba(255,255,255,.7)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	loader: {
		width: width / 2,
	},
});
