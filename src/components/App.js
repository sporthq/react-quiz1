import { useEffect, useReducer } from 'react';
import Header from './Header';
import Main from './Main';
import Loader from './Loader';
import Error from './Error';
import StartScreen from './StartScreen';
import StartScreenPL from './StartScreenPL';
import Question from './Question';
import NextButton from './NextButton';
import Progress from './Progress';
import FinishScreen from './FinishScreen';
import Footer from './Footer';
import Timer from './Timer';
import ChooseLanguage from './ChooseLanguage';

const SECS_PER_QUESTION = 30;
const initialState = {
	questions: [],
	// 'loading', 'error', 'ready','active','finished'
	originalQuestions: [],
	status: 'chooseLanguage',
	index: 0,
	answer: null,
	points: 0,
	highscore: Number(localStorage.getItem('highscore')) || 0,
	secondRemaning: null,
	language: null,
	difficultyLevel: 'easy',
};

function reducer(state, action) {
	switch (action.type) {
		case 'chooseLanguage': {
			return { ...state, language: action.payload, status: 'ready' };
		}
		case 'dataReceived':
			const allQuestion = action.payload;

			return { ...state, questions: allQuestion, originalQuestions:allQuestion, status: 'ready' };
		case 'dataFailed':
			return { ...state, status: 'error' };
		case 'setDifficultyLevel': {
			const filteredQuestions = state.originalQuestions.filter((qst) => {
				return (
					(action.payload === 'easy' && qst.difficulty === 'easy') ||
					(action.payload === 'medium' && (qst.difficulty === 'medium' || qst.difficulty === 'easy')) ||
					(action.payload === 'hard' && (qst.difficulty === 'hard' || qst.difficulty === 'medium' || qst.difficulty === 'easy' ))
				);
			});
			
			return { ...state, difficultyLevel: action.payload, questions: filteredQuestions };
		}

		case 'start':
			return {
				...state,
				status: 'active',
				questions: state.questions,
				secondRemaning: state.questions.length * SECS_PER_QUESTION,
			};
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
			localStorage.setItem('highscore', state.points > state.highscore ? state.points : state.highscore);
			return {
				...state,
				status: 'finished',
				highscore: state.points > state.highscore ? state.points : state.highscore,
			};
		case 'reset': {
			return {
				...initialState,
				questions: state.questions,
				status: 'chooseLanguage',
				highscore: state.highscore
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
	const { questions,  status, index, answer, points, highscore, secondRemaning, language } = state;

	const numOfQst = questions.length;
	console.log(numOfQst);
	const totalPoints =
		questions.length > 0
			? questions.reduce((acc, currentItem) => {
					return acc + currentItem.points;
			  }, 0)
			: 0;

	useEffect(
		function () {
			async function getDate() {
				if (language === null) return;
				try {
					let res;
					if (language === 'English') {
						res = await fetch(`https://fake-server-api.vercel.app/questions`);
					} else if (language === 'Polish') {
						res = await fetch(`https://fake-server-api.vercel.app/questionsPL`);
					}
					if (!res.ok) throw new Error('Something went wrong! Please try again');
					const data = await res.json();
					dispatch({ type: 'dataReceived', payload: data });
				} catch (error) {
					dispatch({ type: 'dataFailed' });
				}
			}

			console.log('wykonuje sie ');
			getDate();
		},
		[dispatch, language]
	);

	return (
		<div className='app'>
			<Header />
			<Main>
				<>
					{status === 'chooseLanguage' && <ChooseLanguage dispatch={dispatch} />}
					{status === 'loading' && <Loader />}
					{status === 'error' && <Error />}
					{status === 'ready' && language === 'English' && <StartScreen numOfQst={numOfQst} dispatch={dispatch} />}
					{status === 'ready' && language === 'Polish' && <StartScreenPL numOfQst={numOfQst} dispatch={dispatch} />}

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
