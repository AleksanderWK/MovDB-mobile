import {useQuery} from "@apollo/client";
import {Content, Item} from "native-base";
import React, {useEffect, useState} from "react";
import {ScrollView, View, StyleSheet, FlatList, ActivityIndicator, Text} from "react-native";
import {MENU_VALUES, SEARCH, SORT, SORT_DIRECTION, MOVIES} from "../../queries";
import Movie from "./Movie";
import MoviePopup from "./MoviePopup";

const styles = StyleSheet.create({
    bg: {
        backgroundColor: "#101010",
        flex: 1
    },
    container: {
        alignItems: "center"
    },
    loader: {
        backgroundColor: "#101010"
    },
    feedback: {
        height: 60,
        marginTop: 20
    },
    danger: {
        color: "#d9534f",
        marginLeft: "auto",
        marginRight: "auto"
    },
    endText: {
        color: "#d4a600",
        marginLeft: "auto",
        marginRight: "auto"
    }
});

interface Movie {
    imdb_id: string;
    original_title: string;
    rating: number;
    poster_path: string;
}

interface Interval {
    start: number;
    end: number;
}

interface Options {
    menuValues: {
        genres: [string];
        productionCountries: [string];
        releaseDateInterval: Interval;
        runtimeInterval: Interval;
    };
    search: string;
    sort: string;
    sortDirection: string;
}

interface Filter {
    genres: [string];
    production_countries: [string];
    release_date: Interval;
    runtime: Interval;
}

interface MoviesQueryParameters {
    search: string;
    sortBy: string;
    sortDirection: string;
    filter: Filter;
    page: number;
    pageSize: number;
}

function MovieContainer() {
    const [variables, setVariables] = useState<MoviesQueryParameters>();
    const [movies, setMovies] = useState<Array<Movie>>([]);

    const [queryCount, setQueryCount] = useState<number>(0);

    const [pageCount, setPageCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const [pageLoaded, setPageLoaded] = useState<boolean>(false);

    const [currentMovie, setCurrentMovie] = useState<string>("");
    const [popupOpen, setPopupOpen] = useState<boolean>(false);

    // Get filter, search and sort values from cache
    // Called automatically when cache is updated
    const {data: menuValuesData} = useQuery(MENU_VALUES);
    const {data: searchData} = useQuery(SEARCH);
    const {data: sortData} = useQuery(SORT);
    const {data: sortDirectionData} = useQuery(SORT_DIRECTION);

    const [options, setOptions] = useState<Options>();

    const PAGE_SIZE = 20;

    // Scroll to top when page unloads, so that the user starts at the top when the page is reloaded
    window.onbeforeunload = function () {
        window.scrollTo(0, 0);
    };

    useEffect(() => {
        // Wait till all values are recieved
        if (menuValuesData && searchData && sortData && sortDirectionData) {
            // Reset currentPage, pageCount and movies array if any of the dependent values are changed
            setCurrentPage(1);
            setPageCount(0);
            setMovies([]);

            setQueryCount((prevQueryCount) => prevQueryCount + 1);

            setOptions({
                menuValues: menuValuesData.menuValues,
                search: searchData.search,
                sort: sortData.sort,
                sortDirection: sortDirectionData.sortDirection
            });
        }
    }, [menuValuesData, searchData, sortData, sortDirectionData]);

    // If options or currentPage changes, update the variables used in the query
    useEffect(() => {
        if (options && currentPage) {
            setVariables({
                search: options.search,
                sortBy: options.sort,
                sortDirection: options.sortDirection,
                filter: {
                    genres: options.menuValues.genres,
                    production_countries: options.menuValues.productionCountries,
                    release_date: options.menuValues.releaseDateInterval,
                    runtime: options.menuValues.runtimeInterval
                },
                page: currentPage,
                pageSize: PAGE_SIZE
            });
        }
    }, [options, currentPage]);

    // Fetch movies based on variables
    // Called on mount and when variables are changed
    const {data: moviesData, loading: queryLoading} = useQuery(MOVIES, {
        variables: variables,
        skip: !variables
    });

    const posterBaseURL = "https://image.tmdb.org/t/p/w400/";

    // On fetch, concatenate already fetched movies with the newly fetched ones
    useEffect(() => {
        if (moviesData) {
            setMovies((prevMovies) => prevMovies.concat(moviesData.movies.movies));
            setPageCount(moviesData.movies.pageCount);
            setPageLoaded(true);
        }
    }, [moviesData]);

    // Increase current page by 1
    const nextPage = () => {
        if (pageLoaded) {
            setPageLoaded(false);
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const renderItem = ({item}: {item: Movie}) => {
        return (
            <Movie
                key={item.imdb_id}
                imdbID={item.imdb_id}
                rating={item.rating}
                title={item.original_title}
                backgroundImage={posterBaseURL + item.poster_path}
                onPress={(imdbID) => {
                    setCurrentMovie(imdbID);
                    setPopupOpen(true);
                }}
            />
        );
    };

    return (
        <Content style={styles.bg} contentContainerStyle={{flex: 1}}>
            <MoviePopup movieId={currentMovie} open={popupOpen} handlePopupClose={() => setPopupOpen(false)} />
            {movies && movies.length !== 0 ? (
                // Movies
                <FlatList
                    data={movies}
                    renderItem={renderItem}
                    extraData={currentPage < pageCount}
                    onEndReached={nextPage}
                    numColumns={2}
                    ListFooterComponent={
                        <View style={styles.feedback}>
                            {queryLoading && <ActivityIndicator size="large" color="#d4a600" style={styles.loader} />}
                            {!queryLoading && pageLoaded && pageCount !== 0 && movies.length > 0 && (
                                <Text style={styles.endText}>
                                    {movies.length} {movies.length === 1 ? "RESULT" : "RESULTS"}
                                </Text>
                            )}
                        </View>
                    }
                    contentContainerStyle={styles.container}
                />
            ) : moviesData && moviesData.movies.movies.length === 0 ? (
                // No results
                <View style={styles.feedback}>
                    <Text style={styles.danger}>NO RESULTS</Text>
                </View>
            ) : (
                // Loading
                <View style={styles.feedback}>
                    {queryLoading && <ActivityIndicator size="large" color="#d4a600" style={styles.loader} />}
                </View>
            )}
        </Content>
    );
}

export default MovieContainer;
