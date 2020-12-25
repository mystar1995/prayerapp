import React from 'react';
import {View, StyleSheet, Animated, Platform} from 'react-native';
import FastImage from 'react-native-fast-image';

const LazyImage = (props) => {
	const {thumbnailSource, fullSource, style, resizeMode} = props,
		thumbOpacity = new Animated.Value(1),
		fullOpacity = new Animated.Value(0);

	const onImageLoad = () => {
		Animated.parallel([
			Animated.timing(fullOpacity, {
				toValue: 1,
				duration: 250,
				useNativeDriver: Platform.OS === 'ios',
			}),
			Animated.timing(thumbOpacity, {
				toValue: 0,
				duration: 250,
				useNativeDriver: Platform.OS === 'ios',
			}),
		]).start();
	};

	var prettyThumbnailSource, prettyFullSource;

	if (thumbnailSource.uri !== '') {
		prettyThumbnailSource =
			thumbnailSource.uri &&
			typeof thumbnailSource.uri === 'string' &&
			!thumbnailSource.uri.split('http')[1]
				? null
				: thumbnailSource.uri;
	}

	if (fullSource.uri !== '') {
		prettyFullSource =
			fullSource.uri &&
			typeof fullSource.uri === 'string' &&
			!fullSource.uri.split('http')[1]
				? null
				: fullSource.uri;
	}

	return (
		<View style={style}>
			{thumbnailSource.uri !== '' && (
				<Animated.View
					style={[
						styles.image,
						{
							opacity: thumbOpacity,
						},
					]}>
					<FastImage
						source={{
							uri:
								Platform.OS === 'android'
									? prettyThumbnailSource
									: thumbnailSource.uri,
						}}
						style={styles.image}
						blurRadius={1}
						resizeMode={
							resizeMode === 'cover'
								? FastImage.resizeMode.cover
								: FastImage.resizeMode.contain
						}
					/>
				</Animated.View>
			)}

			{fullSource.uri !== '' && (
				<Animated.View
					style={[
						styles.image,
						{
							opacity: fullOpacity,
						},
					]}>
					<FastImage
						source={{
							uri:
								Platform.OS === 'android' ? prettyFullSource : fullSource.uri,
						}}
						style={styles.image}
						resizeMode={
							resizeMode === 'cover'
								? FastImage.resizeMode.cover
								: FastImage.resizeMode.contain
						}
						onLoad={onImageLoad}
					/>
				</Animated.View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	image: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
	},
});

export default LazyImage;
