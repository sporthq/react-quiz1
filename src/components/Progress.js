import React from 'react'

export default function Progress({index, numOfQuestions,points, totalPoints,answer}) {
  return (
		<header className='progress'>
            <progress className='progress-bar' max={numOfQuestions} 
			value={index + Number(answer !== null)}> </progress>
			<p>
				Question <strong>{index +1 }</strong> / {numOfQuestions}
			</p>
            <p><strong>{points} / {totalPoints}</strong></p>
		</header>
	);
}
