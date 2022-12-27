import React, {Fragment} from 'react';
import {useIsFocused} from '@react-navigation/native';
import Animated, {SlideInLeft, SlideInRight} from 'react-native-reanimated';
import Colors from '../../assets/design/palette.json';
import {PropDimensions} from '../../dimensions/dimensions';
import Icon from 'react-native-vector-icons/FontAwesome';

// Components
import TextElement from '../resuable/TextElement';
import InputElement from '../resuable/InputElement';

interface SearchHeaderType {
  searchState: string;
  optimizeSearchFunc: any;
}

const SearchHeader: React.FC<SearchHeaderType> = ({
  searchState,
  optimizeSearchFunc,
}) => {
  const isFocused = useIsFocused();

  return (
    <Fragment>
      <TextElement
        cStyle={{color: Colors.white, width: PropDimensions.inputWidth}}>
        Exploer our music streaming app that gives you access to over 90 million
        tracks worldwide and other audio content
      </TextElement>
      {isFocused && (
        <Animated.View entering={SlideInLeft} exiting={SlideInRight}>
          <InputElement
            value={searchState}
            onChange={optimizeSearchFunc}
            placeholder={'Search'}>
            <Icon name={'search'} size={28} color={Colors.primary} />
          </InputElement>
        </Animated.View>
      )}
    </Fragment>
  );
};

export default SearchHeader;
