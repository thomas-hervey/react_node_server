import { combineReducers } from 'redux'
import { reducer as reduxForm } from 'redux-form'
import authReducer from './authReducer'
import surveysReducer from './surveysReducer'

export default combineReducers({
	auth: authReducer, // reducer for user authentication
	form: reduxForm, // the key name 'form' is a redux-form necessity
	surveys: surveysReducer // reducer for listing surveys in dashboard
})
