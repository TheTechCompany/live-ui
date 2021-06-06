import { Grommet } from 'grommet'
import { defaultTheme } from '../src/themes'
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

export const decorators = [
  (Story) => (
    <Grommet
      theme={defaultTheme} 
      plain>
      <Story />
    </Grommet>
  )
]