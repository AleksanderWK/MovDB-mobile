import Dialog, {DialogContent, DialogFooter, DialogTitle, ScaleAnimation} from "react-native-popup-dialog";
import {StyleSheet, View, ScrollView, Text} from "react-native";
import {useQuery} from "@apollo/client";
import React, {useState, useEffect} from "react";
import {MOVIE_DATA} from "../../queries";
import {Badge, Button, Icon} from "native-base";
import Rating from "./Rating";

const styles = StyleSheet.create({
    dialog: {
        backgroundColor: "#1b1b1b",
        width: "95%"
    },
    title: {
        borderBottomWidth: 1,
        borderColor: "#d4a600",
        margin: 10
    },
    text: {
        color: "#fff",
        marginBottom: 3
    },
    headerText: {
        fontSize: 18
    },
    subtext: {
        color: "gray",
        fontSize: 12,
        marginBottom: 3
    },
    badge: {
        backgroundColor: "#d4a600",
        margin: 3
    },
    badgesContainer: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap"
    },
    btnClose: {
        margin: 5,
        backgroundColor: "rgba(52, 52, 52, 0)"
    }
});

interface Props {
    movieId: string;
    open: boolean;
    handlePopupClose: () => void;
}
interface ProductionCountry {
    name: string;
}

interface Movie {
    original_title: string;
    overview: string;
    genres: string[];
    production_countries: [ProductionCountry];
    production_companies: [string];
    release_date: Date;
    runtime: number;
    trailer: string;
    rating: number;
}

function MoviePopup(props: Props) {
    const [movieData, setMovieData] = useState<Movie>();

    // Get movie data for the given movie id (prop)
    const {data} = useQuery(MOVIE_DATA, {
        variables: {imdb_id: props.movieId},
        skip: !props.movieId
    });

    // When movie data is fetched, store it internally
    useEffect(() => {
        if (data) {
            setMovieData(data.movie);
        }
    }, [data]);

    const handleClose = () => {
        if (props.open) {
            props.handlePopupClose();
        }
    };

    return (
        <View>
            {movieData && (
                <Dialog
                    visible={props.open}
                    onTouchOutside={handleClose}
                    dialogTitle={
                        <View style={styles.title}>
                            <View>
                                <Text style={[styles.text, styles.headerText]}>{movieData.original_title}</Text>
                            </View>
                            <Text style={styles.subtext}>
                                {new Date(movieData.release_date).toDateString().slice(4)}
                            </Text>
                        </View>
                    }
                    dialogStyle={styles.dialog}
                    dialogAnimation={new ScaleAnimation({initialValue: 0, useNativeDriver: true} as any)}
                    rounded
                >
                    <View>
                        <Text style={[styles.text, {marginLeft: 10, marginRight: 10}]}>{movieData.overview}</Text>

                        <View
                            style={{
                                margin: 10,
                                borderTopWidth: 1,
                                borderTopColor: "#d4a600"
                            }}
                        >
                            <Text style={[styles.text, {marginTop: 3}]}>
                                <Text style={{fontWeight: "bold"}}>Rating: </Text>
                                <Text>{movieData.rating}</Text>
                            </Text>
                            <Text style={styles.text}>
                                <Text style={{fontWeight: "bold"}}>Runtime: </Text>
                                <Text>{movieData.runtime}min</Text>
                            </Text>
                            <Text style={styles.text}>
                                <Text style={{fontWeight: "bold"}}>
                                    Production{" "}
                                    {movieData.production_companies.length > 1 ? " companies: " : " company: "}
                                </Text>
                                <Text>{movieData.production_companies.join(", ")}</Text>
                            </Text>
                            <View style={[styles.badgesContainer, {marginBottom: 3}]}>
                                {movieData.production_countries.map((list) => (
                                    <Badge style={styles.badge}>
                                        <Text>{list.name}</Text>
                                    </Badge>
                                ))}
                            </View>
                            <View style={styles.badgesContainer}>
                                {movieData.genres.map((list) => (
                                    <Badge style={[styles.badge, {backgroundColor: "#fff"}]}>
                                        <Text>{list}</Text>
                                    </Badge>
                                ))}
                            </View>
                        </View>
                    </View>
                </Dialog>
            )}
        </View>
    );
}

export default MoviePopup;