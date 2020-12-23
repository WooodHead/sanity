import {LinkIcon} from '@sanity/icons'
import {FieldPresence} from '@sanity/base/presence'
import ValidationStatus from 'part:@sanity/components/validation/status'
import React from 'react'
import {Badge, Box, Card, Flex} from '@sanity/ui'
import Preview from '../../../Preview'
import {ConfirmDeleteButton} from '../ConfirmDeleteButton'
import {IntentButton} from '../../../components/IntentButton'

import {DragHandle} from './DragHandle'
import {ItemWithMissingType} from './ItemWithMissingType'
import {ItemLayoutProps} from './ItemLayoutProps'

const dragHandle = <DragHandle grid />

export const ItemCell = React.forwardRef(function RegularItem(
  props: ItemLayoutProps,
  ref: React.ForwardedRef<HTMLElement>
) {
  const focusRef = React.useRef()
  const {
    isSortable,
    value,
    onClick,
    onKeyPress,
    onFocus,
    type,
    readOnly,
    presence,
    onRemove,
    validation,
  } = props
  return (
    <Card radius={2} shadow={1} padding={1} ref={ref}>
      {type ? (
        <Card
          as="button"
          radius={2}
          flex={1}
          tabIndex={0}
          onClick={onClick}
          ref={focusRef}
          onKeyPress={onKeyPress}
          onFocus={onFocus}
        >
          <Box margin={1}>
            <Preview layout="media" value={value} type={type} />
          </Box>
        </Card>
      ) : (
        <Box flex={1}>
          <ItemWithMissingType value={value} onFocus={onFocus} />
        </Box>
      )}
      {!value._key && (
        <Box marginTop={3} marginRight={3} style={{position: 'absolute', top: 0, right: 0}}>
          <Badge mode="outline" tone="caution" padding={2} fontSize={1}>
            Missing key
          </Badge>
        </Box>
      )}

      {!readOnly && (
        <Box style={{position: 'absolute', top: 0, right: 0}}>
          <FieldPresence presence={presence} maxAvatars={1} />
        </Box>
      )}

      <Flex>
        {!readOnly && <Box flex={1}>{isSortable && dragHandle}</Box>}
        {value._key && (
          <Box>
            <ValidationStatus markers={validation} placement="bottom" showSummary={!value._ref} />
          </Box>
        )}
        {value._ref && (
          <Box>
            <IntentButton icon={LinkIcon} intent="edit" params={{id: value._ref}} />
          </Box>
        )}
        {!readOnly && onRemove && (
          <Box>
            <ConfirmDeleteButton onConfirm={onRemove} placement="bottom" title="Remove item" />
          </Box>
        )}
      </Flex>
    </Card>
  )
})
