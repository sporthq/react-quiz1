import { useEffect, useReducer } from 'react';
import Header from './Header';
import Main from './Main';
import Loader from './Loader';
import Error from './Error';
import StartScreen from './StartScreen';
import Question from './Question';
import NextButton from './NextButton';
import Progress from './Progress';
import FinishScreen from './FinishScreen';
import Footer from './Footer';
import Timer from './Timer';

const SECS_PER_QUESTION = 30;
const initialState = {
	questions: [],
	// 'loading', 'error', 'ready','active','finished'
	status: 'loading',
	index: 0,
	answer: null,
	points: 0,
	highscore: 0,
	secondRemaning: null,
};

function reducer(state, action) {
	switch (action.type) {
		case 'dataReceived':
			return { ...state, questions: action.payload, status: 'ready' };
		case 'dataFailed':
			return { ...state, status: 'error' };
		case 'start':
			return { ...state, status: 'active', secondRemaning: state.questions.length * SECS_PER_QUESTION };
		case 'newAnswer':
			const question = state.questions.at(state.index);
			return {
				...state,
				answer: action.payload,
				points: action.payload === question.correctOption ? state.points + question.points : state.points,
			};
		case 'nextQuestion':
			return { ...state, index: state.index + 1, answer: (state.answer = null) };
		case 'finishGame':
			return {
				...state,
				status: 'finished',
				highscore: state.points > state.highscore ? state.points : state.highscore,
			};
		case 'reset': {
			return {
				...initialState,
				questions: state.questions,
				status: 'ready',
			};
		}
		case 'tick': {
			return {
				...state,
				secondRemaning: state.secondRemaning - 1,
				status: state.secondRemaning === 0 ? 'finished' : state.status,
				highscore: state.secondRemaning === 0 ? Math.max(state.points, state.highscore) : state.highscore,
			};
		}
		default:
			throw new Error('Action unkown');
	}
}

function App() {
	const [state, dispatch] = useReducer(reducer, initialState);
	const { questions, status, index, answer, points, highscore, secondRemaning } = state;

	const numOfQst = questions.length;
	const totalPoints = questions.length >  0 ? questions.reduce((acc, currentItem) => {
		return acc + currentItem.points;
	}, 0) : 0

	useEffect(
		function () {
			async function getDate() {
				try {
					const res = await fetch(`https://fake-server-api.vercel.app/questions`);
					if (!res.ok) throw new Error('Something went wrong! Please try again');
					const data = await res.json();
					dispatch({ type: 'dataReceived', payload: data });
				} catch (error) {
					dispatch({ type: 'dataFailed' });
				}
			}

			getDate();
		},
		[dispatch]
	);
	// useEffect(() => {
	// 	fetch(`/questionsPL.json`)
	// 		.then((res) => res.json())
	// 		.then((data) => dispatch({ type: 'dataReceived', payload: data.questions }))
	// 		.catch((err) => dispatch({ type: 'dataFailed' }));
	// }, []);

	return (
		<div className='app'>
			<Header />

			<Main>
				<>
					{status === 'loading' && <Loader />}
					{status === 'error' && <Error />}
					{status === 'ready' && <StartScreen numOfQst={numOfQst} dispatch={dispatch} />}

					{status === 'active' && (
						<>
							<Progress
								index={index}
								numOfQuestions={numOfQst}
								points={points}
								totalPoints={totalPoints}
								answer={answer}
							/>
							<Question question={questions[index]} questions={questions} dispatch={dispatch} answer={answer} />
							<Footer>
								<Timer dispatch={dispatch} secondRemaning={secondRemaning} />
								<NextButton dispatch={dispatch} answer={answer} index={index} numOfQst={numOfQst} />
							</Footer>
						</>
					)}
				</>
				{status === 'finished' && (
					<FinishScreen points={points} totalPoints={totalPoints} highscore={highscore} dispatch={dispatch} />
				)}
			</Main>
		</div>
	);
}

export default App;
