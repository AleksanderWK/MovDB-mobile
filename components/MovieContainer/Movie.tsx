import {StatusBar} from "expo-status-bar";
import React, {useEffect, useState} from "react";
import {StyleSheet, View, Image, ImageSourcePropType} from "react-native";
import {useQuery} from "@apollo/client";
import {MOVIE_DATA} from "../../queries";
import {Card, CardItem, Icon, Text} from "native-base";
import Rating from "./Rating";

const styles = StyleSheet.create({
    card: {
        width: 150,
        height: 225,
        margin: 20,
        backgroundColor: "#101010",
        borderColor: "#101010"
    },
    poster: {
        width: 150,
        height: 225,
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
    return (
        <Card
            style={styles.card}
            onTouchStart={() => {
                props.onPress(props.imdbID);
            }}
        >
            <Image style={styles.poster} source={{uri: props.backgroundImage}} />
            <Rating rating={props.rating} />
        </Card>
    );
}

export default Movie;
