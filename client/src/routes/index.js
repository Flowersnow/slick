import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { MainApp } from "../components/MainApp/MainApp";
import { LoginApp } from "../components/Authentication/App.jsx";

export default () => (
    <BrowserRouter>
        <Switch>
            <Route path="/" exact component={MainApp}/>
            <Route path="/login" exact component={LoginApp}/>
        </Switch>
    </BrowserRouter>
);
