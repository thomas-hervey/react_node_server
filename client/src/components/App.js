import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import * as actions from '../actions'

import Header from './Header'
import Landing from './Landing'
import Dashboard from './Dashboard'
import SurveyNew from './surveys/SurveyNew'

class App extends Component {
	componentDidMount() {
		this.props.fetchUser()
	}
	render () {
		return (
			<div className="container">
				<BrowserRouter>
					<div className="container"> {/* special class name used by Materialize css */}
						<Header />
						<Route exact path="/" component={Landing} />
						<Route exact path="/surveys" component={Dashboard} />
						<Route path="/surveys/new" component={SurveyNew} />
					</div>
				</BrowserRouter>
			</div>
		)
	}
}

// null -> no mapStateToProps
// actions -> pass actions in as props to App
export default connect(null, actions)(App)
