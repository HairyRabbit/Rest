import { h, Color, InkElement } from 'ink'

/// code

export interface Props {
  readonly sum?: number
  readonly completed?: number
  readonly state?: string
}

export default function Header({ sum, completed, state, cast }: Props = Object.create(null)): InkElement {
  return (
    <div>
      <br />
      <div>
        <Color blueBright>
          &gt;
          Tasks ({completed}/{sum})
        </Color>
        <Color gray> ({cast}ms) </Color>
        {state}
      </div>
    </div>
  )
}

