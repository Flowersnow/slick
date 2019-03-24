import { combineReducers } from 'redux';

import { authentication } from './authentication';
import { registration } from './registration';
import { users } from './users.reducer';
import { alert } from './alert';

const rootReducer = combineReducers({
  authentication,
  registration,
  users,
  alert
});

export default rootReducer;