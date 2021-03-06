import React from "react";
import {StyleSheet, Image, TouchableHighlight} from "react-native";
import * as Haptics from "expo-haptics";
import {Card} from "native-base";
import Rating from "./Rating";

const styles = StyleSheet.create({
    card: {
        width: 176,
        height: 249,
        marginLeft: 4,
        marginRight: 4,
        backgroundColor: "#101010",
        borderColor: "#101010"
    },
    poster: {
        width: 176,
        height: 249,
        borderRadius: 4
    }
});

interface Props {
    imdbID: string;
    backgroundImage: string;
    title: string;
    rating: number;
    onPress: (imdbID: string) => void;
}

function Movie(props: Props) {
    Haptics.NotificationFeedbackType.Success;
    return (
        <Card style={styles.card}>
            <TouchableHighlight
                onPress={() => {
                    props.onPress(props.imdbID);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }}
            >
                <Image style={styles.poster} source={{uri: props.backgroundImage}} />
            </TouchableHighlight>
            <Rating rating={props.rating} />
        </Card>
    );
}

export default Movie;
