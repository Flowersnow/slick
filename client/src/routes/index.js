import React, { Component } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { MainApp } from "../components/MainApp/MainApp";
import { LoginPage } from "../components/Authentication/LoginPage";
import { alert, socketAction } from '../actions/index';
import { history } from '../_helpers/index';
import { RegisterPage } from "../components/Authentication/RegisterPage";
import { user } from '../actions/userActions';
import { LOGIN_SUCCESS } from "../actions/actionTypes";

const successSocket = socketAction( user.success );
const initializeSocket = socketAction( user.initialize );

const mapStateToProps = ({ alert }) => ( { alert } );

class Routes extends Component {
    constructor(props) {
        super( props );

        const { dispatch } = this.props;
        history.listen( (location, action) => {
            // clear alert on location change
            dispatch( alert.clear() );
        } );
    }

    PrivateRoute = ({ component: Component, ...rest }) => {

        const user = localStorage.getItem( 'user' );

        if (user) {
            this.props.dispatch( successSocket( JSON.parse( user ) ) );
            this.props.dispatch( initializeSocket() );
            return <Route {...rest} render={props => ( <Component {...props}/> )}/>
        } else {
            return <Route {...rest} render={props => (
                <Redirect to={{ pathname: '/login', state: { from: props.location } }}/> )}/>
        }
    };

    render() {
        const { alert } = this.props;
        const { PrivateRoute } = this;
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

