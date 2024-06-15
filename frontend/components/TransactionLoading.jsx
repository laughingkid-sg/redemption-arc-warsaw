import React from 'react'

const TransactionLoading = () => {
  return (
    <div className='loading-overlay'>
        <div className='loader'></div>
        <p>Processing your transaction...</p>
        <p>This may take a moment as we await blockchain confirmation.</p>
    </div>
  )
}

export default TransactionLoading