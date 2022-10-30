import React from 'react'
import classnames from 'classnames'

function getClassName(locals) {
  const len = locals.path.length
  return classnames({
    ui: true,
    form: true,
    segment: locals.path.length > 0,
    error: locals.hasError,
    'fieldset': true,
    [`fieldset-depth-${len}`]: true,
    [`fieldset-${locals.path.join('-')}`]: len > 0,
    [locals.className]: !!locals.className
  })
}

export default function renderFieldset(children, locals) {
  const legend = locals.label ? <legend className="ui dividing header">{locals.label}</legend> : null
  const props = {
    className: getClassName(locals),
    disabled: locals.disabled
  }
  return React.createElement.apply(null, [
    'fieldset',
    props,
    legend
  ].concat(children))
}
