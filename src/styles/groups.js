import {StyleSheet, Dimensions} from 'react-native';

const height = Dimensions.get('window').height,
    width = Dimensions.get('window').width;

export default StyleSheet.create({
    container: {
        width: width,
        height: height,
        flex:1
    },
    groupViewInnerWrapper:{
        flex:1
    },
    groupView:{
        flex:1
    },
    navlisticons:{
        borderRadius:100,
        width:80,
        height:80,
        backgroundColor:'#EDEDED',
        justifyContent:'center',
        alignItems:'center'
    },
    rownav:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between'
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
    header:{
        textAlign:'center',
        color:'white',
        fontSize:18,
        fontWeight:'bold'
    },
    rowheader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflow: 'hidden',
        paddingLeft:24,
        paddingRight:24
    },
    fixedHeader1: {
        flexWrap: 'wrap',
        zIndex: 999,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor:'#EB237D',
        padding:10
    },
    pageHeader1: {
        fontSize: 28,
        color: '#333',
        fontWeight: 'bold',
        marginTop: 12,
    },
    pageHeader: {
        fontSize: 23,
        color: '#888',
        fontWeight: 'bold',
        marginTop: 12,
        textAlign:'center',
        marginBottom:20
    },
    fixedHeader: {
        flexWrap: 'wrap',
        zIndex: 999,
        width: width,
        marginBottom:20
    },
    searchButton: {
        backgroundColor: '#EB237D',
        padding: 8,
        borderRadius: 5,
    },
    searchIcon: {
        color: 'white',
    },
    groupCellContainer: {
        backgroundColor: 'white',
        borderRadius: 5,
        marginBottom: 24,
        padding: 18,
        flexDirection: 'row',
        alignItems: 'center',
    },
    abbreviationCircle: {
        backgroundColor: '#f1f1f1',
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    abbreviationCircleText: {
        color: '#525252',
        fontWeight: 'bold',
        fontSize: 21,
        textTransform: 'uppercase',
    },
    messageResponse: {
        maxWidth: 360,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginVertical: 18,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    commentSeparator: {
        height: 2,
        backgroundColor: '#f1f1f1',
        width: width,
        maxWidth: 360,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    abbreviationCircleSmall: {
        backgroundColor: '#f1f1f1',
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    abbreviationCircleTextSmall: {
        color: '#525252',
        fontWeight: 'bold',
        fontSize: 14,
        textTransform: 'uppercase',
    },
    groupName: {
        color: '#525252',
        fontSize: 16,
        fontWeight: 'bold',
        flexGrow: 1,
        marginLeft: 8,
    },
    groupArrow: {
        color: '#525252',
    },
    messageCardTopRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    messageCardCenter: {
        flex: 1,
    },
    commentPosterName: {fontSize: 16, color: '#525252', marginBottom: 6},
    commentPosterNameSmall: {fontSize: 14, color: '#525252', marginBottom: 3},
    messageDate: {fontSize: 14, color: '#525252'},
    messageDateSmall: {fontSize: 12, color: '#525252'},
    editButtonIcon: {
        fontSize: 28,
        color: '#525252',
    },
    messageContent: {
        marginVertical: 12,
        fontSize: 16,
        color: '#525252',
        maxWidth: 324,
        width,
    },
    messageContentSmall: {
        marginTop: 12,
        fontSize: 14,
        color: '#525252',
        maxWidth: 324,
        width,
    },
    openDiscussionButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        backgroundColor: '#EB237D',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    openDiscussionText: {fontSize: 16, fontWeight: 'bold', color: 'white'},
    newGroupActionButton: {
        position: 'absolute',
        bottom: 10,
        padding: 16,
        flexDirection: 'row',
        backgroundColor: '#EB237D',
        flexWrap: 'nowrap',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 32,
        marginLeft: 'auto',
        marginRight: 'auto',
        width: 'auto',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.125,
        shadowRadius: 3.5,

        elevation: 3,
    },
    newMessageContainer: {
        backgroundColor: 'white',
        borderRadius: 5,
        marginLeft: 20,
        marginRight: 20,
        padding: 18,
    },
    newMessageTitle: {
        color: '#444',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    newMessageInput: {
        color: 'black',
        backgroundColor: '#ebebeb',
        marginBottom: 20,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 5,
        fontSize: 16,
        overflow: 'hidden',
        marginTop: 12,
        lineHeight: 22,
    },
    endOfListContainer: {
        marginTop: 12,
        marginBottom: 54,
        alignItems: 'center',
    },
    endOfListText: {
        color: 'rgba(68, 68, 68, .5)',
        fontSize: 16,
        marginBottom: 8,
        textAlign: 'center',
    },
    fullThreadView: {
        width,
        flexDirection: 'column',
        flex:1
    },
    fullThreadContainer: {
        backgroundColor: 'white',
        width: width,
        flexDirection:'column',
        flex:1,
        padding:24
    },
    discussionTopContainer: {
        backgroundColor: 'white',
        borderRadius: 5,
        marginTop: 24,
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        paddingBottom: 24,
        borderBottomWidth: 2,
        borderBottomColor: '#f1f1f1'
        // flexBasis: 1,
    },
    commentScrollView: {
        width: width
    },
    fullThreadCommentBottom: {
        maxWidth: 360,
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingVertical: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems:'center',
        marginTop: 10,
    },
    commentInput: {
        backgroundColor: '#f1f1f1',
        padding: 12,
        borderRadius: 5,
        flex: 1,
        maxHeight: 72,
    },
    sendButton: {
        backgroundColor: '#EB237D',
        borderRadius: 5,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 12,
        width: 36,
        height: 36,
    },
    inforow:{
        flexDirection:'row',
        display:'flex',
        marginBottom:10,
        alignItems:'center'
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
		marginBottom: 20,
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderRadius: 5,
		fontSize: 16,
		overflow: 'hidden',
		flex: 1,
    },
    modalInside:{
        backgroundColor:'white',
        padding:20,
        borderRadius:15
    },
    navigateToNewSection:{
        backgroundColor: '#EB237D',
        padding: 8,
        borderRadius: 5,
        alignItems:'center'
    },
    buttonText:{
        color:'white'
    },
    tab:{
        borderStyle:'solid',
        borderWidth:1,
        borderColor:'#EDEDED',
        padding:10,
        flex:1,
        alignItems:'center'
    },
    tabtxt:{
        color:'#888',
        fontSize:16
    },
    title:{
        color:'#888',
        fontWeight:'bold',
        fontSize:23
    }
});
