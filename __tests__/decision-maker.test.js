import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import '@/matchMedia.mock'
import DecisionMaker from '@/pages/decision-maker'

describe('Home', () => {
  it('render the header', () => {
    render(<DecisionMaker />)

    expect(screen.getByText(/Decision Maker/i)).toBeInTheDocument()
  })
})
