
export default function NextButton({ dispatch, answer, index, numOfQst }) {
	
	if (answer === null) return null;

	if (index < numOfQst - 1)
		return (
			<button onClick={() => dispatch({ type: 'nextQuestion' })} className='btn btn-ui'>
				Next question
			</button>
		);
	if (index === numOfQst - 1)
		return (
			<button onClick={() => dispatch({ type: 'finishGame' })} className='btn btn-ui'>
				Show Result
			</button>
		);
}
