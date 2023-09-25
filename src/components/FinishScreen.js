import React from 'react';

export default function FinishScreen({ points, totalPoints, highscore, dispatch }) {
	const percentage = (points / totalPoints) * 100;

	let emoji;

	if (percentage === 100) emoji = '🎖️';
	if (percentage >= 80 && percentage < 100) emoji = '🎉';
	if (percentage >= 50 && percentage < 80) emoji = '😀';
	if (percentage >= 0 && percentage < 50) emoji = '🤔';
	if (percentage === 0) emoji = '🤦‍♂️';

	return (
		<div className='finishScreenGame'>
			<p className='result'>
				You scored{' '}
				<strong>
					{points} / {totalPoints}{' '}
				</strong>{' '}
				({Math.ceil(percentage)}%) {emoji}
			</p>
			<p className='highscore'>
				<strong>(Highscore: {highscore} points)</strong>
			</p>
			<button onClick={() => dispatch({ type: 'reset' })} className='btn btn-ui'>
				Restart Quiz
			</button>
		</div>
	);
}
