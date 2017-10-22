import 'materialize-css/dist/css/materialize.min.css'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import reduxThunk from 'redux-thunk'

import App from './components/App'
import reducers from './reducers'

// TODO: development only axios helpers. Remove
import axios from 'axios'
window.axios = axios

// create a redux store (w/ reducers, and a reduxThunk middleware)
const store= createStore(reducers, {}, applyMiddleware(reduxThunk))

ReactDOM.render(
	// top level provider with store
	<Provider store={store}><App /></Provider>,
	// link with #root in /public.index
	document.querySelector('#root')
)
