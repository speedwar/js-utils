import { createBrowserHistory } from 'history'

export const history = createBrowserHistory()

export function historyPush(url) {
  history.push(url)
}
