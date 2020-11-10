import {useApolloClient, useQuery} from "@apollo/client";
import {Button, Container, Content, Header, Icon, Input, InputGroup} from "native-base";
import React, {useEffect, useState} from "react";
import Drawer from "react-native-drawer";
import {MENU_OPEN, MENU_OPTIONS, MENU_VALUES} from "../../queries";
import Navbar from "../Bars/Navbar";
import SearchBar from "../Bars/SearchBar";
import MovieContainer from "../MovieContainer/MovieContainer";
import {StyleSheet, Text, View} from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1b1b1b",
        alignItems: "center",
        justifyContent: "center"
    },
    btnConfirm: {
        width: "90%",
        backgroundColor: "#d4a600",
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: 15,
        marginTop: 15
    },
    btnReset: {width: "30%", marginLeft: "auto", marginBottom: 15, marginRight: "auto"},
    btnClose: {},
    text: {color: "#ffff"},
    textRed: {color: "#d9534f"}
});

export interface Interval {
    start: number;
    end: number;
}

interface Parameters {
    genres: string[];
    productionCountries: string[];
    releaseDateInterval: Interval;
    runtimeInterval: Interval;
}

function Menu() {
    const client = useApolloClient();

    const [menuOpen, setMenuOpen] = useState(false);
    const [menuValues, setMenuValues] = useState<Parameters | null>();
    const [menuOptions, setMenuOptions] = useState<Parameters | null>();

    // Get menu open data from cache, updates when field change in cache
    const {data: menuOpenData} = useQuery(MENU_OPEN);

    // When menu open data in cachche is changed, set the new value in internal state
    useEffect(() => {
        if (menuOpenData) {
            setMenuOpen(menuOpenData.menuOpen);
        }
    }, [menuOpenData]);

    // Get menu options
    const {data: menuOptionsData, refetch} = useQuery(MENU_OPTIONS);

    if (!menuOptionsData) {
        refetch();
    }

    // When menu options are fetched, store them internally and use them to set default values
    useEffect(() => {
        if (menuOptionsData) {
            setMenuOptions(menuOptionsData.menuOptions);
            setDefaultMenuValues(menuOptionsData.menuOptions);
        }
    }, [menuOptionsData]);

    // Set default menu values from the given options
    const setDefaultMenuValues = (options: Parameters) => {
        const defaultMenuValues: Parameters = {
            genres: [],
            productionCountries: [],
            releaseDateInterval: {
                start: options.releaseDateInterval.start,
                end: options.releaseDateInterval.end
            },
            runtimeInterval: {
                start: options.runtimeInterval.start,
                end: options.runtimeInterval.end
            }
        };

        setMenuValues(defaultMenuValues);
    };

    // When menu is closed and menu values are defined, write the menu values to cache
    useEffect(() => {
        if (!menuOpen && menuValues) {
            client.cache.writeQuery({
                query: MENU_VALUES,
                data: {
                    menuValues: menuValues
                }
            });
        }
    }, [menuValues, menuOpen, client.cache]);

    // On menu close, write to cache
    const toggleDrawer = () => {
        client.cache.writeQuery({
            query: MENU_OPEN,
            data: {
                menuOpen: false
            }
        });
    };

    const handleValueChange = (type: string, value: string[] | Interval) => {
        // Overwrite the old menu value with the updated one for the given type
        const updatedMenuValues = {
            ...menuValues!,
            [type]: value
        };

        // Save updated menu values to state
        setMenuValues(updatedMenuValues);
    };

    return (
        <Drawer
            type="overlay"
            open={menuOpen}
            side="right"
            tapToClose={true}
            content={
                <Container style={styles.container}>
                    <Content></Content>
                    <Button block onPress={toggleDrawer} style={styles.btnConfirm}>
                        <Text style={styles.text}>Confirm</Text>
                    </Button>
                    <Button block bordered danger style={styles.btnReset}>
                        <Text style={styles.textRed}>Reset</Text>
                    </Button>
                </Container>
            }
        >
            <Container>
                <SearchBar />
                <MovieContainer />
                <Navbar />
            </Container>
        </Drawer>
    );
}

export default Menu;
