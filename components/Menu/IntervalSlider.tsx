import React, {useEffect, useState} from "react";
import {Interval} from "./Menu";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import {StyleSheet, View, Text} from "react-native";
import * as Haptics from "expo-haptics";

const styles = StyleSheet.create({
    select: {
        marginTop: 20,

        display: "flex",
        justifyContent: "center"
    },
    header: {
        margin: 10,
        fontSize: 15,
        color: "#fff"
    },
    marker: {backgroundColor: "#d4a600", borderColor: "#d4a600"},
    selected: {backgroundColor: "#d4a600"},
    container: {marginTop: 15, marginLeft: "auto", marginRight: "auto"},
    track: {backgroundColor: "#424242"},
    values: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    text: {
        color: "#fff",
        margin: 10,
        marginTop: -10
    }
});

export interface Props {
    label: string;
    optionValues: Interval;
    onValueChange: (value: Interval) => void;
    values: Interval;
    suffix?: string;
    feedback?: boolean;
    containerScrollEnabled: (value: boolean) => void;
}

function IntervalSlider(props: Props) {
    const [value, setValue] = useState<Interval>(props.values);
    const [currentValue, setCurrentValue] = useState<Interval>(props.values);

    // Update internal state when values prop changes
    useEffect(() => {
        setValue(props.values);
    }, [props.values]);

    // Update internal state on slider change
    const handleChange = (interval: Interval) => {
        setValue(interval);
    };
    Haptics.NotificationFeedbackType.Success;
    return (
        <View style={styles.select}>
            <Text style={styles.header}>Select {props.label}</Text>
            <MultiSlider
                values={[value.start, value.end]}
                min={props.optionValues.start}
                max={props.optionValues.end}
                allowOverlap
                onValuesChange={(value) => {
                    setCurrentValue({start: value[0], end: value[1]});
                    if (props.feedback) {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                }}
                onValuesChangeStart={() => props.containerScrollEnabled(false)}
                onValuesChangeFinish={(value) => {
                    props.containerScrollEnabled(true);
                    let v: Interval = {start: value[0], end: value[1]};
                    handleChange(v);
                    props.onValueChange(v);
                }}
                markerStyle={styles.marker}
                selectedStyle={styles.selected}
                containerStyle={styles.container}
                trackStyle={styles.track}
            />

            <View style={styles.values}>
                <Text style={styles.text}>
                    {currentValue.start} {props.suffix !== undefined ? props.suffix : ""}
                </Text>
                <Text style={styles.text}>
                    {currentValue.end} {props.suffix !== undefined ? props.suffix : ""}
                </Text>
            </View>
        </View>
    );
}

export default IntervalSlider;
