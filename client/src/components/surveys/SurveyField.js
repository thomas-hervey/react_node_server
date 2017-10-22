// SurveyField contains logic to render a single label & text
import React from 'react'

export default ({ input, label, meta: { error, touched } /* nested destructuring */ }) => { // pulls off 'input' from props
	return (
		<div>
			<label>{label}</label>
			{/* equivalent to declaring all functions like: 'onBlur={input.onBlur}' */}
			<input {...input} style={{ 'marginBottom': '5px' }} />
			<div className="red-text" style={{'marginBottom': '20px' }}>
				{touched && error} {/* abuse JS by checking booleans to display error */}
			</div>
		</div>
	)
}
