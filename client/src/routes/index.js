import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import MainView from './MainView';

export default () => (
    <BrowserRouter>
        <Switch>
            <Route path="/" exact component={MainView}/>
        </Switch>
    </BrowserRouter>
);
