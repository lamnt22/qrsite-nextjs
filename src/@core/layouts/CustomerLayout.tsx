import React from 'react'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const CustomerLayout = ({ children }: Props) => {
  return (
    <div>
      <h1 className='text-red-600'>ajhjhsa</h1>
      {children}
    </div>
  )
}

export default CustomerLayout
