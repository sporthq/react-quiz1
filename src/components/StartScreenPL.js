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
			<h2>Witamy w quizie o React!</h2>
			<h3>Sprawdź swoją znajomość Reacta</h3>
			<h4>Wybierz poziom trudności </h4>
			{level !== 'none' && <h4>Liczba pytań: {numOfQst}</h4>}
			<div className='select-box'>
				<select value={level} name='level' id='level' onChange={handleLevel}>
					<option value='none' disabled>
						Wybierz poziom
					</option>
					<option value='easy'>Łatwy </option>
					<option value='medium'>Średni </option>
					<option value='hard'>Trudny </option>
				</select>
			</div>

			<button disabled={level === 'none'} className='btn btn-ui' onClick={() => dispatch({ type: 'start' })}>
				Zaczynajmy!
			</button>
		</div>
	);
}
