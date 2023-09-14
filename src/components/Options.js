import React from 'react';

export default function Options({ question, dispatch, answer }) {
console.log(answer);
    const hasAnswered = answer !== null 
	return (
		<div className='options'>
			{question.options.map((el, index) => (
				<button
					disabled={hasAnswered}
					onClick={() => {
						dispatch({ type: 'newAnswer', payload: index });
					}}
					className={`btn btn-option
                        ${  index === answer ? 'answer' : ''} 

                        ${hasAnswered ? index === question.correctOption ? 'correct' : 'wrong' : ''}
                        
                        
                        `}
					key={el}
				>
					{el}
				</button>
			))}
		</div>
	);
}
