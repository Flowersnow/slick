import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { user as userAction } from '../../actions';

class AdminPage extends React.Component {
    componentDidMount() {
        this.props.dispatch( userAction.getAll() );
    }

    handleDeleteUser(id) {
        return (e) => this.props.dispatch( userAction.delete( id ) );
    }

    logout() {
        this.props.dispatch( userAction.logout() );
    }

    render() {
        const { user, users } = this.props;
        return (
            <div className="col-md-6 col-md-offset-3">
                <h1>Hi {user.firstName}!</h1>
                <p>You're logged in Admin View with Slick React!!</p>
                <h3>All registered users:</h3>
                {users.loading && <em>Loading users...</em>}
                {users.error && <span className="text-danger">ERROR: {users.error}</span>}
                {users.items &&
                <ul>
                    {users.items.map( (displayingUser) => {
                            if (displayingUser.username !== user.username) {
                                return <li key={displayingUser.id}>
                                    {displayingUser.firstName + ' ' + displayingUser.lastName}
                                    {
                                        displayingUser.deleting ? <em> - Deleting...</em>
                                            : displayingUser.deleteError ?
                                            <span className="text-danger"> - ERROR: {displayingUser.deleteError}</span>
                                            : <span> - <a
                                                onClick={this.handleDeleteUser( displayingUser.id )}>Delete</a></span>
                                    }
                                </li>
                            }
                        }
                    )}
                </ul>
                }
                <p>
                    <Link to="/login" onClick={this.logout}>Logout</Link>
                </p>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { users, authentication } = state;
    const { user } = authentication;
    return {
        user,
        users
    };
}

const connectedAdminPage = connect( mapStateToProps )( AdminPage );
export { connectedAdminPage as AdminPage };