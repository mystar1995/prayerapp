import {Dimensions, StyleSheet} from 'react-native';

const height = Dimensions.get('window').height,
  width = Dimensions.get('window').width;

export default StyleSheet.create({
  flatListSelect: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    position: 'relative',
  },
  fieldTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 8,
    width: width * 0.35,
  },
  flatlistSelectButton: {
    borderBottomWidth: 2,
    borderBottomColor: 'black',
    flex: 1,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    paddingHorizontal: 6,
  },
  flatListWrapper: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    minHeight:300,
    alignSelf: 'flex-end',
    elevation:2
  },
  flatListContainer: {
    borderWidth: 1,
    borderColor: '#EFEFEF',
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingTop: 12,
    borderRadius: 8,
    marginTop: 8,
    flex:1
  },
  selectableButton: {
    backgroundColor: 'white',
    paddingVertical: 6,
    elevation:4,
    zIndex:100000
  },
  selectableText: {
    fontSize: 16,
    color: 'black',
  },
});
