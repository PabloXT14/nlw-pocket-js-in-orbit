export async function createGoalCompletion(goalId: string) {
  await fetch(`http://localhost:3333/goals/${goalId}/completions`, {
    method: 'POST',
  })
}
