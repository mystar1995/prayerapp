import {StyleSheet, Dimensions} from 'react-native';

const height = Dimensions.get('window').height,
	width = Dimensions.get('window').width;

export default StyleSheet.create({
	homeContainer: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		justifyContent: 'center',
		backgroundColor: '#f1f1f1',
	},
	homeBackground: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
	},
	darkenedBackground: {
		position: 'absolute',
		height: height,
		width: width,
		backgroundColor: 'rgba(0,0,0,.65)',
	},
	dateText: {
		color: 'white',
		fontSize: 22,
		marginBottom: 60,
		textAlign: 'center',
	},
	homeContent: {},
	scrollContainer: {
		maxHeight: height * 0.5,
	},
	quote: {
		width: width,
		flexDirection: 'row',
		justifyContent: 'center',
	},
	quoteIcon: {
		color: 'white',
		textAlign: 'center',
		marginTop: -12,
	},
	leftLine: {
		position: 'absolute',
		left: 0,
		right: width * 0.55,
		borderTopWidth: 2,
		borderColor: 'white',
	},
	rightLine: {
		position: 'absolute',
		left: width * 0.55,
		right: 0,
		borderTopWidth: 2,
		borderColor: 'white',
	},
	prayerText: {
		color: 'white',
		width: width * 0.9,
		maxWidth: 412,
		marginLeft: 'auto',
		marginRight: 'auto',
		marginTop: 36,
		marginBottom: 36,
		textAlign: 'center',
		fontSize: 24,
	},
	buttonContainer: {
		flexDirection: 'row',
		flexWrap: 'nowrap',
		alignItems: 'center',
		display:'flex',
		paddingLeft:width * 0.06,
		paddingRight:width * 0.06,
		marginTop:20,
	},
	button: {
		paddingVertical: 14,
		flexDirection: 'row',
		flexWrap: 'nowrap',
		alignItems: 'center',
		alignContent: 'center',
		justifyContent: 'center',
		borderRadius: 8,
		marginTop: 42,
		width: width * 0.41,
		zIndex:100
	},
	buttonIcon: {},
	buttonText: {fontSize: 16, fontWeight: 'bold', paddingLeft: 8},
});
