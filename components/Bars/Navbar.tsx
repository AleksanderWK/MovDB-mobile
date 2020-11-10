import React, {useState} from "react";
import {Footer, FooterTab, Button, Icon, Text, Container} from "native-base";
import {useApolloClient, useQuery} from "@apollo/client";
import {MENU_OPEN} from "../../queries";
import SortBar from "./SortBar";
import {View, StyleSheet} from "react-native";

const styles = StyleSheet.create({
    bar: {
        backgroundColor: "#1b1b1b",
        borderTopWidth: 0
    },
    icon: {
        color: "#d4a600"
    },
    text: {
        color: "#d4a600"
    }
});

function Navbar() {
    const [sortVisible, toggleSort] = useState<boolean>(false);

    const {data} = useQuery(MENU_OPEN);
    const client = useApolloClient();

    // Set menu open field in cache to true when menu button is clicked
    const toggleMenu = () => {
        client.cache.writeQuery({
            query: MENU_OPEN,
            data: {
                menuOpen: true
            }
        });
    };

    return (
        <View>
            <SortBar
                visible={sortVisible}
                toggleVisible={() => {
                    toggleSort(!sortVisible);
                }}
            />
            <Footer style={styles.bar}>
                <FooterTab>
                    <Button
                        vertical
                        onPress={() => {
                            toggleSort(!sortVisible);
                        }}
                    >
                        <Icon name="funnel" style={styles.icon} />
                        <Text style={styles.text}>Sort</Text>
                    </Button>
                    <Button vertical onPress={toggleMenu}>
                        <Icon name="options" style={styles.icon} />
                        <Text style={styles.text}>Filter</Text>
                    </Button>
                </FooterTab>
            </Footer>
        </View>
    );
}

export default Navbar;
