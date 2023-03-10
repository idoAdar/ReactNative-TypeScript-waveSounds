import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Animated, {FadeInDown} from 'react-native-reanimated';
import FastImage from 'react-native-fast-image';
import {PropDimensions} from '../../dimensions/dimensions';
import Colors from '../../assets/design/palette.json';
import Icon from 'react-native-vector-icons/FontAwesome';

// Components
import TextElement from '../resuable/TextElement';

interface SearchItemType {
  title: string;
  artist: string;
  image: string;
  index: number;
  playSoundTrack(): void;
}

const SearchItem: React.FC<SearchItemType> = ({
  title,
  artist,
  image,
  index,
  playSoundTrack,
}) => {
  return (
    <Animated.View
      entering={FadeInDown.delay(100 * index).springify()}
      style={styles.searchContainer}>
      <View style={styles.details}>
        <TextElement
          fontSize={'sm'}
          fontWeight={'bold'}
          cStyle={styles.text}
          numberOfLines={1}>
          {artist}
        </TextElement>
        <TextElement cStyle={styles.text} numberOfLines={2}>
          {title}
        </TextElement>
      </View>
      <TouchableOpacity onPress={playSoundTrack} style={styles.icon}>
        <Icon name={'play'} size={28} color={Colors.primary} />
        <TextElement fontWeight={'bold'} fontSize={'sm'} cStyle={styles.text}>
          Play
        </TextElement>
      </TouchableOpacity>
      <FastImage source={{uri: image}} style={styles.image} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    width: PropDimensions.searchWidth,
    height: PropDimensions.searchHeight,
    backgroundColor: Colors.secondary,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 5,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  details: {
    padding: 8,
  },
  icon: {
    position: 'absolute',
    top: '5%',
    right: '5%',
  },
  image: {
    width: '100%',
    height: '70%',
  },
  text: {
    color: Colors.black,
    textAlign: 'left',
  },
});

export default SearchItem;
