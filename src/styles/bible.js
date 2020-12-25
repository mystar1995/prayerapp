import {StyleSheet, Dimensions} from 'react-native';

const height = Dimensions.get('window').height,
  width = Dimensions.get('window').width;

export default StyleSheet.create({
  container: {
    width: width,
    height: height,
    paddingLeft:24,
    paddingRight:24
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden'
  },
  fixedHeader: {
    flexWrap: 'wrap',
    zIndex: 999,
  },
  pageHeader: {
    fontSize: 28,
    color: '#333',
    fontWeight: 'bold',
    marginTop: 12,
  },
  filterButton: {
    backgroundColor: '#EB237D',
    padding: 8,
    borderRadius: 5,
  },
  filterIcon: {
    color: 'white',
  },
  bibleContentContainer: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
  },
  bibleContentVerseNumber: {
    fontWeight: 'bold',
    marginRight: 6,
    position: 'relative',
    width: 24,
  },
  bibleContentVerse: {
    flex: 1,
  },
  buttonRow: {
    width: width,
    maxWidth: 360,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  bibleNavigationButton: {
    paddingVertical: 14,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginTop: 42,
    width: width * 0.41,
    overflow: 'hidden',
    backgroundColor: '#EB237D',
  },
  bibleNavigationButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 8,
    color: 'white',
  },
  bibleNavigationButtonIcon: {
    position: 'absolute',
    color: 'white',
    zIndex: -1,
  },
  modalInside: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
  },
  pickerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    width: '100%',
  },
  navigateToNewSection: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginBottom: 18,
    width: width - 64,
    backgroundColor: '#EB237D',
    alignSelf: 'center',
    position: 'relative',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
