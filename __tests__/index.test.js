import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import '@/matchMedia.mock'
import Home  from '@/pages/index'

describe('Home', () => {
  it('render the app sucessful', () => {
    render(<Home />)
  })
})
