import React, { Component } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { MainApp } from "../components/MainApp/MainApp";
import { LoginPage } from "../components/Authentication/LoginPage";
import { alert } from '../actions/index';
import { history } from '../_helpers/index';
import { RegisterPage } from "../components/Authentication/RegisterPage";
// import { PrivateRoute } from "../_components";

const mapStateToProps = ({ alert }) => ( { alert } );

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        localStorage.getItem('user')
            ? <Component {...props} />
            : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    )} />
);

class Routes extends Component {
    constructor(props) {
        super( props );

        const { dispatch } = this.props;
        history.listen( (location, action) => {
            // clear alert on location change
            dispatch( alert.clear() );
        } );
    }

    render() {
        const { alert } = this.props;
        return (
            <div className="jumbotron">
                <div className="container">
                    <div className="col-sm-8 col-sm-offset-2">
                        {alert.payload &&
                        <div className={`alert ${alert.type}`}>{alert.payload}</div>
                        }
                        <Router history={history}>
                            <Switch>
                                <PrivateRoute path="/" exact component={MainApp}/>
                                <div>
                                    <link rel="stylesheet"
                                          href="https://netdna.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"/>
                                    <Route path="/login" component={LoginPage}/>
                                    <Route path="/register" component={RegisterPage}/>
                                </div>
                            </Switch>
                        </Router>
                    </div>
                </div>
            </div>
        )
    }
}

const Routed = connect( mapStateToProps )( Routes );
export { Routed as Routes };

