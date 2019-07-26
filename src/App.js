import React from 'react';
import './App.css';
import 'typeface-roboto';
import Main from "./Components/Main";
import {SnackbarProvider} from 'notistack';

export default class App extends React.Component {
    render() {
        return (
            <SnackbarProvider maxSnack={3}>
                <Main></Main>
            </SnackbarProvider>
        );
    }
}
