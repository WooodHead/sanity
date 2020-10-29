import React, {useEffect} from 'react'
import schema from 'part:@sanity/base/schema'
import {getTemplateErrors} from '@sanity/base/initial-value-templates'
import {InitialValueTemplateError} from './initialValueTemplateError'
import {SchemaErrors} from './schemaErrors'
import {ProblemGroupPath} from './types'

interface Props {
  children: () => React.ReactNode
}

declare const __DEV__: boolean

function renderPath(path: ProblemGroupPath) {
  return path
    .map(segment => {
      if (segment.kind === 'type') {
        return `${segment.name || '<unnamed>'}(${segment.type})`
      }

      if (segment.kind === 'property') {
        return segment.name
      }

      if (segment.kind === 'type') {
        return `${segment.type}(${segment.name || '<unnamed>'})`
      }

      return null
    })
    .filter(Boolean)
    .join(' > ')
}

function reportWarnings() {
  if (!__DEV__) {
    return
  }
  /* eslint-disable no-console */
  const problemGroups = schema._validation

  const groupsWithWarnings = problemGroups.filter(group =>
    group.problems.some(problem => problem.severity === 'warning')
  )
  if (groupsWithWarnings.length === 0) {
    return
  }
  console.groupCollapsed(`⚠️ Schema has ${groupsWithWarnings.length} warnings`)
  groupsWithWarnings.forEach((group, i) => {
    const path = renderPath(group.path)
    console.group(`%cAt ${path}`, 'color: #FF7636')
    group.problems.forEach((problem, j) => {
      console.log(problem.message)
    })
    ;(console as any).groupEnd(`At ${path}`)
  })
  ;(console as any).groupEnd('Schema warnings')
  /* eslint-enable no-console */
}

export function SchemaErrorReporter(props: Props) {
  const problemGroups = schema._validation

  const groupsWithErrors = problemGroups.filter(group =>
    group.problems.some(problem => problem.severity === 'error')
  )

  useEffect(reportWarnings, [])

  if (groupsWithErrors.length > 0) {
    return <SchemaErrors problemGroups={groupsWithErrors} />
  }

  const templateErrors = getTemplateErrors(undefined as any)
  if (templateErrors.length > 0) {
    return <InitialValueTemplateError errors={templateErrors} />
  }

  return <>{props.children()}</>
}