import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { MainApp } from "../components/MainApp";


export default () => (
    <BrowserRouter>
        <Switch>
            <Route path="/" exact component={MainApp}/>
        </Switch>
    </BrowserRouter>
);
