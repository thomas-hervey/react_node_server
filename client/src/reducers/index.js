import { combineReducers } from 'redux'
import { reducer as reduxForm } from 'redux-form'
import authReducer from './authReducer'

export default combineReducers({
	auth: authReducer,
	form: reduxForm // the key name 'form' is a redux-form necessity
})
