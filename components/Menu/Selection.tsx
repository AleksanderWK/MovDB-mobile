import {storeValueIsStoreObject} from "@apollo/client/cache/inmemory/helpers";
import React, {useEffect, useState} from "react";
import {StyleSheet, Text, View} from "react-native";
// @ts-ignore
import CustomMultiPicker from "react-native-multiple-select-list";

const styles = StyleSheet.create({
    select: {
        /*
        borderStyle: "solid",
        borderColor: "#d4a600",
        borderWidth: 1,
        borderRadius: 3,
        */
        marginTop: 20
    },
    header: {
        margin: 10,
        fontSize: 15,
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
    const [selected, setSelected] = useState<string[]>(props.values);

    // Update internal state when new values are selected
    const handleChange = (res: string[]) => {
        setSelected(res);
    };

    // Update internal state when values prop changes
    useEffect(() => {
        setSelected(props.values);
    }, [props.values]);

    return (
        <View style={styles.select}>
            <Text style={styles.header}>Select {props.label}</Text>
            <CustomMultiPicker
                options={props.optionValues}
                multiple={true} // should select multiple?
                returnValue={"label"} // label or value
                callback={(res: string[]) => {
                    handleChange(res);
                    props.onValueChange(res);
                }} // callback, array of selected items
                rowBackgroundColor={"#424242"}
                rowHeight={45}
                rowRadius={5}
                iconColor={"#d4a600"}
                iconSize={30}
                selectedIconName={"ios-add-circle"}
                unselectedIconName={"ios-add-circle-outline"}
                scrollViewHeight={220}
                selected={selected}
            />
        </View>
    );
}

export default Selection;
