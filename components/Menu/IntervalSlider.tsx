import React, {useEffect, useState} from "react";
import {Interval} from "./Menu";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import {StyleSheet, View, Text} from "react-native";

const styles = StyleSheet.create({
    select: {
        /*
        borderStyle: "solid",
        borderColor: "#d4a600",
        borderWidth: 1,
        borderRadius: 3,
        */
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
    prefix: string;
}

function IntervalSlider(props: Props) {
    const [value, setValue] = useState<Interval>(props.values);

    // Update internal state when values prop changes
    useEffect(() => {
        setValue(props.values);
    }, [props.values]);

    // Update internal state on slider change
    const handleChange = (interval: Interval) => {
        setValue(interval);
    };

    return (
        <View style={styles.select}>
            <Text style={styles.header}>Select {props.label}</Text>
            <MultiSlider
                values={[value.start, value.end]}
                min={props.optionValues.start}
                max={props.optionValues.end}
                allowOverlap
                onValuesChangeFinish={(value) => {
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
                    {value.start} {props.prefix}
                </Text>
                <Text style={styles.text}>
                    {value.end} {props.prefix}
                </Text>
            </View>
        </View>
    );
}

export default IntervalSlider;
