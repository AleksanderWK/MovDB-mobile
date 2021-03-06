import React from "react";
import {Text, StyleSheet, View} from "react-native";

const styles = StyleSheet.create({
    badge: {
        position: "absolute",
        bottom: 0,
        right: 0,
        margin: 2,
        width: 30,
        height: 20,
        borderRadius: 5,
        justifyContent: "center"
    },
    text: {
        color: "#fff",
        alignSelf: "center"
    }
});

interface Props {
    rating: number;
}

function Rating(props: Props) {
    const ratingColor = () => {
        let value: number = Math.round(props.rating);
        switch (value) {
            case 9:
                return {backgroundColor: "#00a11b"};
            case 8:
                return {backgroundColor: "#04d200"};
            case 7:
                return {backgroundColor: "#90de00"};
            case 6:
                return {backgroundColor: "#d2d200"};
            case 5:
                return {backgroundColor: "#cfa200"};
            case 4:
                return {backgroundColor: "#d17900"};
            case 3:
                return {backgroundColor: "#d22300"};
            case 2:
                return {backgroundColor: "#a20000"};
            case 1:
                return {backgroundColor: "#650000"};
        }
    };

    return (
        <View style={[styles.badge, ratingColor()]}>
            <Text style={styles.text}>{props.rating.toFixed(1)}</Text>
        </View>
    );
}

export default Rating;
