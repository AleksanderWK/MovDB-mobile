import {useQuery} from "@apollo/client";
import React, {useEffect, useState} from "react";
import {ScrollView, View, StyleSheet} from "react-native";
import {MENU_VALUES, SEARCH, SORT, SORT_DIRECTION, MOVIES} from "../../queries";
import Movie from "./Movie";

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#101010"
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
            const moviesArray = moviesData.movies.movies.map((movie: Movie) => (
                <Movie
                    key={movie.imdb_id}
                    imdbID={movie.imdb_id}
                    rating={movie.rating}
                    title={movie.original_title}
                    backgroundImage={posterBaseURL + movie.poster_path}
                    onPress={(imdbID) => {
                        setCurrentMovie(imdbID);
                        setPopupOpen(true);
                    }}
                />
            ));

            setMovies((prevMovies) => prevMovies.concat(moviesArray));
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

    return <ScrollView style={styles.container}>{movies}</ScrollView>;
}

export default MovieContainer;