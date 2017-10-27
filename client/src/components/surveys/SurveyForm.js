// SurveyForm shows a form for a user to add input
import _ from 'lodash'
import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form'
import { Link } from 'react-router-dom'
import formFields from './formFields'

import SurveyField from './SurveyField'
import validateEmails from '../../utils/validateEmails'

class SurveyForm extends Component {

	renderFields() {
		return _.map(formFields, ({ label, name }) => {
			return <Field key={name} component={SurveyField} type="text" name={name} label={label}/>
		})
	}

	render() {
		return (
			<div>
				<form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}> {/* call onSurveySubmit function */}
					{this.renderFields()}
					<Link to="/surveys" className="red btn-flat white-text">
						Cancel
					</Link>
					<button
						type="submit"
						className="teal btn-flat right white-text">
						Next
						<i className="material-icons right">done</i></button>
				</form>
			</div>
		)
	}
}

// author generated validation that passes back an object w/ or w/out errors
function validate(values) {
	const errors = {}

	errors.recipients = validateEmails(values.recipients || '') // validate emails

	// validate simple fields
	// not specifically the field 'name', but on the fly, check if a property exists
	_.each(formFields, ({ name }) => {
		if (!values[name]) {
			errors[name] = 'You must provide a value'
		}
	})

	return errors // if no errors, reduxForm assumes no errors
	// also, reduxForm automatically matches errors to their respective input field
}

// reduxForm helper that takes in necessary options
export default reduxForm({
	validate,
	form: 'surveyForm',
	destroyOnUnmount: false // if unmount, persist form values to next page
})(SurveyForm)
