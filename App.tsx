import React from "react";
import {ApolloProvider} from "@apollo/client";
import {ApolloClient, InMemoryCache, NormalizedCacheObject} from "@apollo/client";
import Menu from "./components/Menu/Menu";
import {LogBox} from "react-native";
LogBox.ignoreAllLogs();

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    uri: "http://it2810-23.idi.ntnu.no:3000/",
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    menuValues: {
                        merge: false
                    },
                    menuOpen: {
                        merge: false
                    }
                }
            }
        }
    })
});

function App() {
    return (
        <ApolloProvider client={client}>
            <Menu />
        </ApolloProvider>
    );
}

export default App;
