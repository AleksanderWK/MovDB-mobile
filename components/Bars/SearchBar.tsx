import React, {useEffect, useState} from "react";
import {StyleSheet, Text, Keyboard} from "react-native";
import {Button, Header, Icon, Input, InputGroup} from "native-base";
import {useApolloClient} from "@apollo/client";
import {SEARCH} from "../../queries";
import * as Haptics from "expo-haptics";

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#1b1b1b",
        height: 45,
        display: "flex",
        justifyContent: "space-between",
        borderBottomWidth: 0
    },
    searchField: {
        width: "79%",
        height: 30,
        backgroundColor: "#424242",
        alignSelf: "center",
        borderRadius: 5,
        borderBottomWidth: 0
    },
    btnSearch: {
        height: 30,
        alignSelf: "center",
        marginLeft: 4,
        backgroundColor: "#d4a600"
    },
    btnClear: {
        paddingTop: 1
    },
    icon: {
        color: "#d4a600"
    },
    input: {
        lineHeight: 21,
        color: "#fff"
    },
    text: {
        color: "#fff"
    }
});

function SearchBar() {
    Haptics.NotificationFeedbackType.Success;

    const client = useApolloClient();
    const [search, setSearch] = useState<string>("");

    useEffect(() => {
        // Write default value ("") to cache
        client.cache.writeQuery({
            query: SEARCH,
            data: {
                search: ""
            }
        });
    }, [client.cache]);

    // On submit, write the search text to cache
    const handleSubmit = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Keyboard.dismiss();
        client.cache.writeQuery({
            query: SEARCH,
            data: {
                search: search
            }
        });
    };

    // On search input change, update search value state
    const handleChange = (text: string) => {
        setSearch(text);
    };

    return (
        <Header searchBar rounded style={styles.header} iosBarStyle="light-content">
            <InputGroup style={styles.searchField}>
                <Icon name="ios-search" style={styles.icon} />
                <Input
                    style={styles.input}
                    placeholder="Search movies..."
                    onChangeText={(value: string) => {
                        handleChange(value);
                    }}
                    keyboardAppearance="dark"
                    clearButtonMode="always"
                />
            </InputGroup>
            <Button style={styles.btnSearch} onPress={handleSubmit}>
                <Text style={styles.text}>Search</Text>
            </Button>
        </Header>
    );
}

export default SearchBar;
