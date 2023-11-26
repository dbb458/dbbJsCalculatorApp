import { useReducer } from 'react';
import { DigitButton } from './DigitButton';
import { OperationButton } from './OperationButton';

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose_operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate',
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        if (payload.digit === '.') {
          return {
            ...state,
            currentOperand: `0${payload.digit}`,
            overwrite: false,
          };
        }

        if (state.currentOperand === '-') {
          return {
            ...state,
            currentOperand: `${state.currentOperand}${payload.digit}`,
            overwrite: false,
          };
        }

        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }

      if (state.currentOperand === '0' && payload.digit !== '.') {
        return {
          ...state,
          currentOperand: payload.digit,
        };
      }

      if (payload.digit === '0' && state.currentOperand === '0') {
        return state;
      }

      if (payload.digit === '.') {
        if (state.currentOperand && state.currentOperand.includes('.')) {
          return state;
        }

        if (state.currentOperand === '-') {
          return {
            ...state,
            currentOperand: `${state.currentOperand}0${payload.digit}`,
          };
        }

        if (
          state.previousOperand &&
          state.operation &&
          state.currentOperand == null
        ) {
          return {
            ...state,
            currentOperand: `0${payload.digit}`,
          };
        }

        if (
          (state.currentOperand === '0' || state.currentOperand == null) &&
          state.previousOperand == null
        ) {
          return {
            ...state,
            currentOperand: `0${payload.digit}`,
          };
        }
      }

      return {
        ...state,
        currentOperand: `${state.currentOperand || ''}${payload.digit}`,
      };
    // break;
    case ACTIONS.CHOOSE_OPERATION:
      if (payload.operation === '-') {
        if (
          (state.currentOperand === '0' || state.currentOperand == null) &&
          state.previousOperand == null
        ) {
          return {
            ...state,
            currentOperand: payload.operation,
          };
        }
        if (
          state.previousOperand !== null &&
          state.operation !== '-' &&
          !state.currentOperand
        ) {
          return {
            ...state,
            currentOperand: payload.operation,
          };
        }
      } else if (
        (state.currentOperand === '0' || state.currentOperand == null) &&
        state.previousOperand == null
      ) {
        return state;
      }

      if (
        state.previousOperand &&
        state.operation &&
        state.currentOperand === '-'
      ) {
        return {
          ...state,
          operation: payload.operation,
          currentOperand: null,
        };
      }

      if (
        state.currentOperand === '-' &&
        state.previousOperand == null &&
        state.operation == null
      ) {
        return state;
      }

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
        overwrite: true,
      };
    // break;
    case ACTIONS.CLEAR:
      return {
        currentOperand: '0',
        previousOperand: null,
        operation: null,
      };
    // break;
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite && !state.previousOperand && !state.operation) {
        return {
          ...state,
          overwrite: false,
          currentOperand: '0',
        };
      }

      if (
        state.currentOperand == null &&
        state.previousOperand &&
        state.operation
      ) {
        return {
          currentOperand: '0',
        };
      }

      if (state.previousOperand && state.currentOperand === '0') {
        return {
          ...state,
          currentOperand: null,
        };
      }

      if (state.currentOperand == null || state.currentOperand === '0') {
        return state;
      }

      if (state.currentOperand.length === 1 && state.operation) {
        return { ...state, currentOperand: null };
      }

      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: '0' };
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state;
      }

      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      };
    default:
  }
};

const evaluate = ({ currentOperand, previousOperand, operation }) => {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);

  if (isNaN(prev) || isNaN(current)) {
    return '';
  }

  let computation = '';

  switch (operation) {
    case '+':
      computation = prev + current;
      break;
    case '-':
      computation = prev - current;
      break;
    case '*':
      computation = prev * current;
      break;
    case '÷':
      computation = prev / current;
      break;
    default:
      break;
  }

  return computation.toString();
};

function App() {
  const [{ currentOperand = '0', previousOperand, operation }, dispatch] =
    useReducer(reducer, {});

  console.log(typeof currentOperand);

  return (
    <>
      <div className='calculator-grid'>
        <div className='output'>
          <div className='previous-operand'>
            {previousOperand} {operation}
          </div>
          <div
            id='display'
            className='current-operand'
          >
            {currentOperand}
          </div>
        </div>
        <button
          id='clear'
          className='span-two'
          onClick={() => dispatch({ type: ACTIONS.CLEAR })}
        >
          AC
        </button>
        <button
          id='delete'
          onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}
        >
          DEL
        </button>
        <OperationButton
          id='divide'
          operation='÷'
          dispatch={dispatch}
        />
        <DigitButton
          id='one'
          digit='1'
          dispatch={dispatch}
        />
        <DigitButton
          id='two'
          digit='2'
          dispatch={dispatch}
        />
        <DigitButton
          id='three'
          digit='3'
          dispatch={dispatch}
        />
        <OperationButton
          id='multiply'
          operation='*'
          dispatch={dispatch}
        />
        <DigitButton
          id='four'
          digit='4'
          dispatch={dispatch}
        />
        <DigitButton
          id='five'
          digit='5'
          dispatch={dispatch}
        />
        <DigitButton
          id='six'
          digit='6'
          dispatch={dispatch}
        />
        <OperationButton
          id='subtract'
          operation='-'
          dispatch={dispatch}
        />
        <DigitButton
          id='seven'
          digit='7'
          dispatch={dispatch}
        />
        <DigitButton
          id='eight'
          digit='8'
          dispatch={dispatch}
        />
        <DigitButton
          id='nine'
          digit='9'
          dispatch={dispatch}
        />
        <OperationButton
          id='add'
          operation='+'
          dispatch={dispatch}
        />
        <DigitButton
          id='decimal'
          digit='.'
          dispatch={dispatch}
        />
        <DigitButton
          id='zero'
          digit='0'
          dispatch={dispatch}
        />
        <button
          id='equals'
          className='span-two'
          onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
        >
          =
        </button>
      </div>
      <div className='footer'>
        <p>
          Built by <span>Daryl Bonayog</span>
        </p>
      </div>
    </>
  );
}

export default App;
