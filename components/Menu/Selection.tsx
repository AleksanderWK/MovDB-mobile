import {storeValueIsStoreObject} from "@apollo/client/cache/inmemory/helpers";
import React, {useEffect, useState} from "react";
import {StyleSheet, Text, View} from "react-native";
// @ts-ignore
import ReactChipsInput from "react-native-chips";
import * as Haptics from "expo-haptics";

const styles = StyleSheet.create({
    select: {},
    chip: {
        backgroundColor: "#d4a600",
        borderWidth: 0,
        marginLeft: 10,
        marginTop: 10
    },
    input: {
        backgroundColor: "#424242",
        borderRadius: 5,
        width: "95%",
        alignSelf: "center",
        marginTop: 20,
        color: "#fff",
        fontSize: 15
    },
    label: {
        fontSize: 15,
        color: "#fff"
    },
    labelOnBlur: {
        color: "#fff"
    }
});

export interface Props {
    label: string;
    optionValues: string[];
    onValueChange: (value: string[]) => void;
    values: string[];
}

function Selection(props: Props) {
    Haptics.NotificationFeedbackType.Success;

    return (
        <View style={styles.select}>
            <ReactChipsInput
                label={"Select " + props.label}
                initialChips={props.values}
                onChangeChips={(chips: string[]) => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    props.onValueChange(chips);
                }}
                chipStyle={styles.chip}
                inputStyle={styles.input}
                labelStyle={styles.label}
                labelOnBlur={styles.labelOnBlur}
            />
        </View>
    );
}

export default Selection;
