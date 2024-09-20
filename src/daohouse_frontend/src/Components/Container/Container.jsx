import React from 'react'

const Container = ({children, classes}) => {
  return (
    <div className={`max-w-[1600px] m-auto ${classes}`}>
        {children}
    </div>
  )
}

export default Container