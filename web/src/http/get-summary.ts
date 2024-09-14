import type { ISummary } from '../@types/summary'

export async function getSummary(): Promise<ISummary> {
  const response = await fetch('http://localhost:3333/summary')
  const data = await response.json()

  return data.summary
}
