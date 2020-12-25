import React, {useEffect, useState, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  View,
  Text,
  Animated,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
  Platform,
} from 'react-native';
import _ from 'lodash';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faFilter,
  faChevronRight,
  faChevronLeft,
} from '@fortawesome/pro-solid-svg-icons';
import Modal from 'react-native-modal';
import {SafeAreaView} from 'react-native-safe-area-context';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import LottieView from 'lottie-react-native';
import BibleContent from '../components/BibleContent';
import FlatListSelect from '../components/FlatListSelect';
import styles from '../styles/bible';
import loaderStyles from '../styles/loader';
import getBibleContent from '../util/getBibleContent';
import * as bibleActions from '../containers/BibleContainer/actions';
import {books} from '../constants/kingJamesBooks';

const Bible = (props) => {
  const {navigation} = props,
    {
      loading,
      Book,
      Chapter,
      Content,
      NextTitle,
      PrevTitle,
      nextEnabled,
      prevEnabled,
    } = useSelector((state) => state.bible),
    [localState, setState] = useState({
      modalVisible: false,
      navigateToBook: '',
      navigateToChapter: '',
      chapterOptions: [],
    }),
    opacity = useRef(new Animated.Value(0)).current,
    dispatch = useDispatch(),
    bookOptions = _.map(books, (book) => {
      return book.Title;
    });

  const background = require('../assets/images/login-background.png');

  useEffect(() => {
    const fetchContent = async () => {
      dispatch(bibleActions.setLoading(true));

      await getBibleContent(Book).then((response) => {
        const {book} = response;
        if(book && typeof book[Chapter] != 'undefined')
        {
          let iterable = book[Chapter][Object.keys(book[Chapter])[1]],
          fixedData = _.map(iterable, (chapter) => {
            return {...chapter};
          });

          dispatch(bibleActions.setBookContent(fixedData));

        }
          
        dispatch(bibleActions.setLoading(false));
      });
    };

    fetchContent();
  }, [Chapter]);

  useEffect(() => {
    if (loading) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }).start();
    }
  }, [loading]);

  useEffect(() => {
    const {navigateToBook} = localState;

    if (navigateToBook !== '') {
      const chapterOptions = _.find(books, ['Title', navigateToBook]).Chapters;

      setState({
        ...localState,
        chapterOptions,
      });
    } else {
      setState({
        ...localState,
        chapterOptions: [],
      });
    }
  }, [localState.navigateToBook]);

  const renderFooter = () => {
    return (
      <View style={[styles.row,{marginBottom:30}]}>
        <TouchableOpacity
          disabled={!prevEnabled}
          onPress={() => previousChapter()}
          style={[
            styles.bibleNavigationButton,
            {opacity: prevEnabled ? 1 : 0.5},
          ]}>
          <FontAwesomeIcon
            icon={faChevronLeft}
            size={72}
            style={[styles.bibleNavigationButtonIcon, {left: -12}]}
          />
          <Text style={styles.bibleNavigationButtonText}>{PrevTitle}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!nextEnabled}
          onPress={() => nextChapter()}
          style={[
            styles.bibleNavigationButton,
            {opacity: nextEnabled ? 1 : 0.5},
          ]}>
          <Text style={styles.bibleNavigationButtonText}>{NextTitle}</Text>
          <FontAwesomeIcon
            icon={faChevronRight}
            size={72}
            style={[styles.bibleNavigationButtonIcon, {right: -12}]}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const nextChapter = () => {
    const currentBook = _.find(books, ['Title', Book]);
    if(!currentBook)
    {
      return;
    }
      const {Chapters} = currentBook,
      currentChapterIndex = _.indexOf(Chapters, Chapter) + 1,
      isLast = currentChapterIndex === Chapters.length;

    if (isLast) {
      // We need to change chapters to the next chapter
      // We need to set the previous accordingly (see if we are at the first of the book)
      const previousBookTitle = Book,
        previousChapter = Chapter,
        currentBookIndex = _.findIndex(books, ['Title', Book]);
      
        const nextBookTitle = books[currentBookIndex + 1].Title,
        nextBookChapters = books[currentBookIndex + 1].Chapters;

      dispatch(bibleActions.setCurrentBook(nextBookTitle));
      dispatch(bibleActions.setCurrentChapter(1));

      dispatch(
        bibleActions.setPrevChapterTitle(
          `${previousBookTitle} ${previousChapter}`,
        ),
      );

      // Check to see if the next chapter is the last one.
      if (nextBookChapters.length === 1) {
        dispatch(
          bibleActions.setNextChapterTitle(
            `${books[currentBookIndex + 2].Title} 1`,
          ),
        );
      } else {
        dispatch(bibleActions.setNextChapterTitle(`${nextBookTitle} 2`));
      }

      // We should additionally check to see if this is the last of the entire bible.
    } else {
      // Check to see if the next chapter is the last one.
      if (Chapters.length === currentChapterIndex + 1) {
        const currentBookIndex = _.findIndex(books, ['Title', Book]),
          nextBookTitle = books[currentBookIndex + 1].Title;

        dispatch(bibleActions.setNextChapterTitle(`${nextBookTitle} 1`));
      } else {
        dispatch(bibleActions.setNextChapterTitle(`${Book} ${Chapter + 2}`));
      }

      dispatch(bibleActions.setPrevChapterTitle(`${Book} ${Chapter}`));
      dispatch(bibleActions.setCurrentChapter(Chapter + 1));
      dispatch(bibleActions.setPreviousButtonEnabled(true));
    }
  };

  const previousChapter = () => {
    if (Chapter === 1) {
      // We need to go back a book.
      const currentBookIndex = _.findIndex(books, ['Title', Book]),
        previousBookTitle = books[currentBookIndex].Title,
        previousBookChapters = books[currentBookIndex].Chapters;

      if (Book !== 'Matthew') {
        dispatch(bibleActions.setNextChapterTitle(`${Book} ${Chapter}`));
        dispatch(
          bibleActions.setPrevChapterTitle(
            `${previousBookTitle} ${
              previousBookChapters[previousBookChapters.length]
            }`,
          ),
        );
        dispatch(bibleActions.setCurrentBook(previousBookTitle));
        dispatch(
          bibleActions.setCurrentChapter(
            previousBookChapters[previousBookChapters.length],
          ),
        );
      }
    } else {
      dispatch(bibleActions.setNextChapterTitle(`${Book} ${Chapter}`));
      dispatch(bibleActions.setPrevChapterTitle(`${Book} ${Chapter - 2}`));
      dispatch(bibleActions.setCurrentChapter(Chapter - 1));
      dispatch(bibleActions.setPreviousButtonEnabled(true));

      if (Book === 'Matthew' && Chapter - 1 === 1) {
        dispatch(bibleActions.setPreviousButtonEnabled(false));
        dispatch(bibleActions.setPrevChapterTitle(''));
      }
    }
  };

  useEffect(()=>{
    navigation.addListener('focus',function(){
      StatusBar.setBackgroundColor("#EB237D");
    })
},[])

  const navigateToNewBookChapter = () => {
    const {navigateToBook, navigateToChapter} = localState,
      newBookIndex = _.findIndex(books, ['Title', navigateToBook]);
    
    if(newBookIndex < 0)
    {
      return;
    }

    dispatch(bibleActions.setCurrentBook(navigateToBook));

    const setNextChapter = () => {
      // See if we are at the end of the chapter selected.
      const newBook = books[newBookIndex];

      if (newBook && newBook.Chapters && navigateToChapter === newBook.Chapters[newBook.Chapters.length - 1]) {
        // Our next title will need to be the next book.
        // TODO: HERE;
      } else {
        dispatch(
          bibleActions.setNextChapterTitle(
            `${navigateToBook} ${navigateToChapter + 1}`,
          ),
        );
      }
    };

    // We should check if this is the beginning of the bible or end of the bible.
    if (navigateToBook === 'Matthew' && navigateToChapter === 1) {
      dispatch(bibleActions.setPreviousButtonEnabled(false));
      dispatch(bibleActions.setPrevChapterTitle(''));
      dispatch(
        bibleActions.setNextChapterTitle(
          `${navigateToBook} ${navigateToChapter + 1}`,
        ),
      );
      dispatch(bibleActions.setNextButtonEnabled(true));
    } else if (navigateToBook === 'Revelation' && navigateToChapter === 22) {
      dispatch(bibleActions.setNextChapterTitle(''));
      dispatch(bibleActions.setNextButtonEnabled(false));
      dispatch(
        bibleActions.setPrevChapterTitle(
          `${navigateToBook} ${navigateToChapter - 1}`,
        ),
      );
      dispatch(bibleActions.setPreviousButtonEnabled(true));
    } else if (navigateToChapter === 1) {
      // Get our previous book's
      const previousBook = books[newBookIndex - 1];

      dispatch(
        bibleActions.setPrevChapterTitle(
          `${previousBook.Title} ${
            previousBook.Chapters[previousBook.Chapters.length - 1]
          }`,
        ),
      );

      setNextChapter();
    } else {
      dispatch(
        bibleActions.setPrevChapterTitle(
          `${navigateToBook} ${navigateToChapter - 1}`,
        ),
      );
      setNextChapter();
    }

    // Last action.
    dispatch(bibleActions.setCurrentChapter(navigateToChapter));

    setState({
      modalVisible: false,
      navigateToBook: '',
      navigateToChapter: '',
      chapterOptions: [],
    });
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.backgroundImage}
        source={background}
        resizeMode="cover"
      />
      <View
        style={[
          styles.row,
          styles.fixedHeader,
          {
            marginTop:Platform.OS === 'ios'
            ? getStatusBarHeight()
            : StatusBar.currentHeight
          },
        ]}>
        <Text style={styles.pageHeader}>Bible</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() =>
            setState({
              ...localState,
              modalVisible: true,
            })
          }>
          <FontAwesomeIcon
            icon={faFilter}
            size={14}
            style={styles.filterIcon}
          />
        </TouchableOpacity>
      </View>

      <SafeAreaView>
        <FlatList
          data={Content}
          removeClippedSubviews={false}
          contentContainerStyle={{
            paddingBottom: 148,
          }}
          
          showsVerticalScrollIndicator={false}
          renderItem={(content) => <BibleContent content={content} />}
          ListFooterComponent={() => renderFooter()}
          keyExtractor={(item, index) => index}
        />
      </SafeAreaView>

      <Animated.View
        style={[
          loaderStyles.loaderContainer,
          {opacity, zIndex: loading ? 99999 : -1},
        ]}>
        <LottieView
          autoPlay
          style={loaderStyles.loader}
          source={require('../assets/animations/loader.json')}
        />
      </Animated.View>

      <Modal
        isVisible={localState.modalVisible}
        onBackdropPress={() => {
          setState({
            modalVisible: false,
            navigateToBook: '',
            navigateToChapter: '',
          });
        }}>
        <View style={styles.modalInside}>
          <FlatListSelect
            onSelect={(value) => {
              setState({
                ...localState,
                navigateToBook: value,
              });
            }}
            key="navigateToBook"
            title="Book"
            options={bookOptions}
            selectedValue={localState.navigateToBook}
          />

          <FlatListSelect
            enabled={localState.navigateToBook !== ''}
            onSelect={(value) => {
              setState({
                ...localState,
                navigateToChapter: value,
              });
            }}
            key="navigateToChapter"
            title="Chapter"
            options={localState.chapterOptions}
            selectedValue={localState.navigateToChapter}
          />

          <TouchableOpacity
            style={styles.navigateToNewSection}
            onPress={() => navigateToNewBookChapter()}>
            <Text style={styles.buttonText}>Go</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default Bible;
