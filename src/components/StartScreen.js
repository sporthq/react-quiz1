import { useState } from 'react';

export default function StartScreen({ numOfQst, dispatch }) {
	const [level, setLevel] = useState('none');

	console.log(numOfQst);
	function handleLevel(e) {
		console.log(e.target.value);
		setLevel(e.target.value);
		dispatch({ type: 'setDifficultyLevel', payload: e.target.value });
	}
	return (
		<div className='start'>
			<h2>Welcome to The React Quiz!</h2>
			<h3>Test your knowledge of React</h3>
			<h4>Choose a difficulty level </h4>
			{level !== 'none' && <h4>Number of questions: {numOfQst}</h4>}
			<div className='select-box'>
				<select value={level} name='level' id='level' onChange={handleLevel}>
					<option value='none' disabled>
						Select level
					</option>
					<option value='easy'>Easy </option>
					<option value='medium'>Medium </option>
					<option value='hard'>Hard </option>
				</select>
			</div>

			<button disabled={level === 'none'} className='btn btn-ui' onClick={() => dispatch({ type: 'start' })}>
				Let's Start!
			</button>
		</div>
	);
}
