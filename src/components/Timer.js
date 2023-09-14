import React, { useEffect } from 'react';

export default function Timer({ dispatch, secondRemaning }) {
	const minutes = Math.floor(secondRemaning / 60);
	const seconds = secondRemaning % 60;
	useEffect(() => {
		const id = setInterval(function () {
			dispatch({ type: 'tick', payload: '' });
		}, 1000);

		return () => clearInterval(id);
	}, [dispatch]);

	return (
		<div className='timer'>
			{minutes < 10 && '0'}
			{minutes}:{seconds < 10 && '0'}
			{seconds}
		</div>
	);
}
