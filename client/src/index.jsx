import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import { store } from './_helpers';
import { LoginApp } from './components/Authentication/App.jsx';

render(
    <Provider store={store}>
        <LoginApp />
    </Provider>,
    document.getElementById('app')
);