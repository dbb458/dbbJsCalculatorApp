import React from 'react';
import { ACTIONS } from './App';

export const OperationButton = ({ dispatch, operation, id }) => {
  return (
    <button
      id={id}
      onClick={() =>
        dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation } })
      }
    >
      {operation}
    </button>
  );
};
