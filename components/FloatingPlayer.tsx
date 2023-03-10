import React, {useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';
import Animated, {
  FadeInDown,
  FadeOutUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {useAppSelector, useAppDispatch} from '../redux/hooks';
import {cleanFloatingPlayer} from '../redux/slices/deezerSlice';
import {PropDimensions} from '../dimensions/dimensions';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../assets/design/palette.json';

// Components
import TextElement from './resuable/TextElement';

const END_REACH = Dimensions.get('window').width * 0.7;
const OUT_SCREEN = Dimensions.get('window').width * 1.15;

interface FloatingPlayerType {
  playerStatus: boolean;
  setPlayerStatus: any;
  openModal(): void;
}

const FloatingPlayer: React.FC<FloatingPlayerType> = ({
  playerStatus,
  setPlayerStatus,
  openModal,
}) => {
  const currentTrack = useAppSelector(state => state.deezerSlice.currentTrack);
  const floatingPlayer = useAppSelector(
    state => state.deezerSlice.floatingPlayer,
  )!;

  const dispatch = useAppDispatch();

  const offset = useSharedValue(0);
  const start = useSharedValue(0);
  const isTocuhed = useSharedValue(false);

  useEffect(() => {
    setPlayerStatus(true);
  }, [floatingPlayer]);

  const onPause = () => {
    setPlayerStatus(false);
    currentTrack?.pause();
  };

  const onPlay = () => {
    setPlayerStatus(true);
    currentTrack?.play();
  };

  const onGestureClose = () => {
    currentTrack?.stop();
    setTimeout(() => {
      dispatch(cleanFloatingPlayer());
    }, 100);
  };

  const gesture = Gesture.Pan()
    .runOnJS(true)
    .onBegin(() => {
      isTocuhed.value = true;
    })
    .onUpdate(event => {
      offset.value = event.translationX + start.value;
    })
    .onEnd(e => {
      isTocuhed.value = false;
      if (e.translationX > END_REACH) {
        offset.value = withTiming(OUT_SCREEN);
        onGestureClose();
      } else {
        offset.value = withSpring(0);
      }
    });

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{translateX: offset.value}],
      backgroundColor: isTocuhed.value ? '#666565bd' : '#525050bd',
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        entering={FadeInDown}
        exiting={FadeOutUp}
        style={[styles.mainContainer, animatedStyles]}>
        <View style={styles.side}>
          <FastImage
            source={{uri: floatingPlayer.image}}
            resizeMode={'cover'}
            style={styles.image}
          />
          <View style={styles.details}>
            <TextElement
              numberOfLines={1}
              cStyle={{color: Colors.white, width: 200}}>
              {floatingPlayer.title}
            </TextElement>
            <TextElement fontSize={'sm'} cStyle={{color: Colors.white}}>
              {floatingPlayer.artist}
            </TextElement>
          </View>
        </View>
        <View style={styles.side}>
          <TouchableOpacity onPress={openModal}>
            <Icon
              name={'expand'}
              size={28}
              color={Colors.secondary}
              style={styles.details}
            />
          </TouchableOpacity>
          {playerStatus ? (
            <TouchableOpacity onPress={onPause}>
              <Icon name={'pause'} size={28} color={Colors.secondary} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={onPlay}>
              <Icon name={'play'} size={28} color={Colors.secondary} />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    height: 50,
    alignSelf: 'center',
    elevation: 5,
    width: PropDimensions.fullWidth,
    position: 'absolute',
    bottom: 50,
    left: 0,
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  side: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '75%',
  },
  details: {
    marginHorizontal: 16,
  },
  image: {
    width: 35,
    height: 35,
  },
});

export default FloatingPlayer;
