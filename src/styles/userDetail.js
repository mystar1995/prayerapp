import {StyleSheet, Dimensions} from 'react-native';

const height = Dimensions.get('window').height,
	width = Dimensions.get('window').width;

export default StyleSheet.create({
	container: {
		width: width,
		height: height
	},
	btn:{
		paddingLeft:10,
		paddingRight:10,
		paddingTop:10,
		paddingBottom:10,
		borderRadius:50,
		borderColor:'white',
		borderWidth:3,
		marginRight:10
	},	
	selectedbtn:{
		paddingLeft:10,
		paddingRight:10,
		paddingTop:10,
		paddingBottom:10,
		borderRadius:50,
		borderColor:'white',
		borderWidth:3,
		backgroundColor:'white',
		marginRight:10
	},
	backgroundImage: {
		width: width,
		height: height,
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		top: 0,
		opacity: 0.3,
	},
	pageHeader: {
		fontSize: 28,
		marginBottom: 36,
		color: '#333',
		fontWeight: 'bold',
		marginTop: 12,
		maxWidth: 360,
		width: width,
		marginLeft: 'auto',
		marginRight: 'auto',
		textAlign: 'left',
	},
	accountDetailsContainer: {
		maxWidth: 360,
		marginLeft: 'auto',
		marginRight: 'auto',
	},
	infoRow: {
		flexDirection: 'row',
		alignItems: 'center',
		alignContent: 'center',
		marginBottom:20
	},
	label: {
		fontSize: 12,
		color: 'black',
		opacity: 0.7,
		width: width * 0.25,
		textTransform: 'uppercase',
	},
	input: {
		color: 'black',
		backgroundColor: '#ebebeb',
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderRadius: 5,
		fontSize: 16,
		overflow: 'hidden',
		flex: 1,
	},
	authIconContainer: {
		flex: 1,
		borderRadius: 5,
		marginBottom: 20,
		paddingVertical: 12,
		paddingHorizontal: 16,
		flexDirection: 'row',
		alignItems: 'center',
		// justifyContent: 'center',
	},
	authIcon: {
		color: 'white',
	},
	authMethodText: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 16,
		paddingLeft: 8,
	},
	infoRowInnerContainer: {
		width: width * 0.65,
		paddingHorizontal: 16,
	},
	infoDescription: {
		fontSize: 14,
		color: 'black',
		opacity: 1,
		marginBottom: 12,
	},
	buttonContainer: {
		maxWidth: 360,
		flexDirection: 'row',
		flexWrap: 'nowrap',
		alignItems: 'center',
		justifyContent: 'space-between',
		flex:1
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
	},
	endOfRequests: {
		marginTop: 12,
		marginBottom: 54,
		alignItems: 'center',
	  },
	  endOfRequestsText: {
		color: 'rgba(68, 68, 68, .5)',
		fontSize: 16,
		marginBottom: 8,
		textAlign: 'center',
	  },
	buttonIcon: {},
	buttonText: {fontSize: 16, fontWeight: 'bold', paddingLeft: 8},
});
