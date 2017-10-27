import axios from 'axios'
import { FETCH_USER, FETCH_SURVEYS } from './types'

// fetch user action creator
export const fetchUser = () => async dispatch => {
	const res = await axios.get('/api/current_user')
	dispatch({ type: FETCH_USER, payload: res.data })
}

export const handleToken = token => async dispatch => {
	const res = await axios.post('/api/stripe', token)
	dispatch({ type: FETCH_USER, payload: res.data })
}

export const submitSurvey = (values, history) => async dispatch => {
	const res = await axios.post('/api/surveys', values)
	history.push('/surveys') // redirect from within action creator
	dispatch({ type: FETCH_USER, payload: res.data })
}

export const fetchSurveys = (values) => async dispatch => {
	const res = await axios.post('/api/surveys', values)
	dispatch({ type: FETCH_SURVEYS, payload: res.data })
}
