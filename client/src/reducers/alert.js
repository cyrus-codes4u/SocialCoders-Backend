// Alert Reducer
/***
 * Sample alert object arriving in the action payload
 * {
 *  id: 1,
 *  msg: 'Please don't make me kill you',
 *  alertType: 'success'
 * }
 ***/

import { SET_ALERT, REMOVE_ALERT } from '../actions/types'

const initialState = []

export default function (state = initialState, action) {
  const { type, payload } = action

  switch (type) {
    case SET_ALERT:
      return [...state, payload]
    case REMOVE_ALERT:
      return state.filter((alert) => alert.id !== payload)
    default:
      return state
  }
}
