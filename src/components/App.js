import { useEffect, useReducer } from 'react';
import Header from './Header';
import Main from './Main';
import Loader from './Loader';
import Error from './Error';
import StartScreen from './StartScreen';
import Question from './Question.';
const initialState = {
	questions: [],
	// 'loading', 'error', 'ready','active','finished'
	status: 'loading',
	index: 0,
	answer: null,
	points: 0
};


function reducer(state, action) {
	switch (action.type) {
		case 'dataRecived':
			return { ...state, questions: action.payload, status: 'ready' };
		case 'dataFailed':
			return { ...state, status: 'error' };
		case 'start':
			return { ...state, status: 'active' };
		case 'newAnswer':
			const question = state.questions.at(state.index)

			return { ...state, answer: action.payload , points: action.payload === question.correctOption ? state.points + question.points : state.points };
		default:
			throw new Error('Action unkown');
	}
}

function App() {
	
	const [state, dispatch] = useReducer(reducer, initialState);
	const { questions, status, index,answer } = state;
	const numOfQst = questions.length;
	useEffect(function () {
		async function getDate() {
			try {
				const res = await fetch('http://localhost:8000/questions');
				if (!res.ok) throw new Error('Something went wrong! Please try again');
				const data = await res.json();
				dispatch({ type: 'dataRecived', payload: data });

				
			} catch (error) {
				dispatch({ type: 'dataFailed' });
			}
		}

		getDate();
	}, []);

	return (
		<div className='app'>
			<Header />

			<Main>
				{status === 'loading' && <Loader />}
				{status === 'error' && <Error />}
				{status === 'ready' && <StartScreen numOfQst={numOfQst} dispatch={dispatch} />}
				{status === 'active' && <Question question={questions[index]} questions={questions} dispatch={dispatch} answer={answer} />}
			</Main>
		</div>
	);
}

export default App;
