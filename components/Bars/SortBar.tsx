import React, {useEffect, useState} from "react";
import {ImageBackground, StyleSheet, Text, View, Modal} from "react-native";
import {Button, Col, Container, Content, Grid, Header, Icon, Input, InputGroup} from "native-base";
import {useApolloClient, useQuery} from "@apollo/client";
import {SEARCH, SORT, SORT_DIRECTION} from "../../queries";

const styles = StyleSheet.create({
    sortbar: {
        width: "100%",
        height: 250,
        backgroundColor: "#1b1b1b",
        position: "absolute",
        bottom: 0,
        zIndex: 1
    },
    btnClose: {
        margin: 5,
        position: "absolute",
        backgroundColor: "#1b1b1b",
        top: 0,
        right: 0
    },
    grid: {
        marginTop: 45
    },
    col: {
        height: "100%",
        margin: 5
    },
    btnOption: {
        backgroundColor: "#424242",
        marginBottom: 2
    },
    btnSelected: {
        backgroundColor: "#d4a600"
    },
    text: {
        color: "#fff"
    },
    icon: {
        marginLeft: 0
    }
});

type Sort = "rating" | "original_title" | "runtime" | "release_date" | "none";
type SortDirection = "ASC" | "DESC";

interface Props {
    visible: boolean;
    toggleVisible: (visible: boolean) => void;
}

function SortBar(props: Props) {
    const client = useApolloClient();

    const [sort, setSort] = useState<Sort>("rating");
    const [sortDirection, setSortDirection] = useState<SortDirection>("DESC");

    // Get search value from cache
    const {data: searchData} = useQuery(SEARCH);

    // If search value is none, set sorting to rating DESC,
    // else, set sort to "none", which means sort by relevance to search
    useEffect(() => {
        if (searchData && searchData.search === "") {
            setSort("rating");
            setSortDirection("DESC");
        } else if (searchData && searchData.search !== "") {
            setSort("none");
        }
    }, [searchData]);

    // Write sort value to cache
    useEffect(() => {
        client.cache.writeQuery({
            query: SORT,
            data: {
                sort: sort
            }
        });
    }, [sort, client.cache]);

    // Write sort direction value to cache
    useEffect(() => {
        client.cache.writeQuery({
            query: SORT_DIRECTION,
            data: {
                sortDirection: sortDirection
            }
        });
    }, [sortDirection, client.cache]);

    // Update sort state when a new sort is clicked
    const handleSortByClick = (newSort: Sort) => {
        if (newSort !== sort) {
            setSort(newSort);
        } else {
            setSort("none");
        }
    };

    // Update sort direction state when a new sort direction is clicked
    const handleSortDirectionClick = (newSortDirection: SortDirection) => {
        if (newSortDirection !== sortDirection) {
            setSortDirection(newSortDirection);
        }
    };

    return (
        <Modal animationType="slide" transparent={true} visible={props.visible}>
            <View style={styles.sortbar}>
                <Button
                    vertical
                    style={styles.btnClose}
                    onPress={() => {
                        props.toggleVisible(false);
                    }}
                >
                    <Icon name={"close"} />
                </Button>

                <Grid style={styles.grid}>
                    <Col style={styles.col}>
                        <Content>
                            <Button
                                style={sort === "rating" ? [styles.btnOption, styles.btnSelected] : [styles.btnOption]}
                                block
                                onPress={() => handleSortByClick("rating")}
                            >
                                <Icon name="star" style={styles.icon} />
                                <Text style={styles.text}>Rating</Text>
                            </Button>
                            <Button
                                style={
                                    sort === "original_title"
                                        ? [styles.btnOption, styles.btnSelected]
                                        : [styles.btnOption]
                                }
                                block
                                onPress={() => handleSortByClick("original_title")}
                            >
                                <Icon name="book" style={styles.icon} />
                                <Text style={styles.text}>Original title</Text>
                            </Button>
                            <Button
                                style={sort === "runtime" ? [styles.btnOption, styles.btnSelected] : [styles.btnOption]}
                                block
                                onPress={() => handleSortByClick("runtime")}
                            >
                                <Icon name="stopwatch" style={styles.icon} />
                                <Text style={styles.text}>Runtime</Text>
                            </Button>
                            <Button
                                style={
                                    sort === "release_date"
                                        ? [styles.btnOption, styles.btnSelected]
                                        : [styles.btnOption]
                                }
                                onPress={() => handleSortByClick("release_date")}
                                block
                            >
                                <Icon name="calendar" style={styles.icon} />
                                <Text style={styles.text}>Release date</Text>
                            </Button>
                        </Content>
                    </Col>
                    <Col style={styles.col}>
                        <Content>
                            <Button
                                style={
                                    sortDirection === "ASC"
                                        ? [styles.btnOption, styles.btnSelected]
                                        : [styles.btnOption]
                                }
                                onPress={() => handleSortDirectionClick("ASC")}
                                disabled={sort === "none"}
                                block
                            >
                                <Icon name="arrow-up" style={styles.icon} />
                                <Text style={styles.text}>ASC</Text>
                            </Button>
                            <Button
                                style={
                                    sortDirection === "DESC"
                                        ? [styles.btnOption, styles.btnSelected]
                                        : [styles.btnOption]
                                }
                                onPress={() => handleSortDirectionClick("DESC")}
                                disabled={sort === "none"}
                                block
                            >
                                <Icon name="arrow-down" style={styles.icon} />
                                <Text style={styles.text}>DESC</Text>
                            </Button>
                        </Content>
                    </Col>
                </Grid>
            </View>
        </Modal>
    );
}

export default SortBar;