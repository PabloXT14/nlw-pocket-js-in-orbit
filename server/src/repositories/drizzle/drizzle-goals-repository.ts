import { db } from '../../db'
import { goals } from '../../db/schema'
import type { CreateGoalDTO, GoalsRepository } from '../goals-repository'

export class DrizzleGoalsRepository implements GoalsRepository {
  async create(data: CreateGoalDTO) {
    const result = await db
      .insert(goals)
      .values({
        title: data.title,
        desiredWeeklyFrequency: data.desiredWeeklyFrequency,
      })
      .returning()

    const goal = result[0]

    return goal
  }
}
