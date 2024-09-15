import { X } from 'lucide-react'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import {
  RadioGroup,
  RadioGroupIndicator,
  RadioGroupItem,
} from './ui/radio-group'
import { Button } from './ui/button'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { createGoal } from '../http/create-goal'

const FREQUENCY_OPTIONS = [
  { value: '1', label: '1x na semana', icon: '🥱' },
  { value: '2', label: '2x na semana', icon: '🙂' },
  { value: '3', label: '3x na semana', icon: '😎' },
  { value: '4', label: '4x na semana', icon: '😜' },
  { value: '5', label: '5x na semana', icon: '🤨' },
  { value: '6', label: '6x na semana', icon: '🤯' },
  { value: '7', label: 'Todos dias da semana', icon: '🔥' },
]

const createGoalFormSchema = z.object({
  title: z.string().min(1, 'Informe o nome da meta que deseja realizar'),
  desiredWeeklyFrequency: z.coerce.number().min(1).max(7),
})

type CreateGoalFormData = z.infer<typeof createGoalFormSchema>

export const CreateGoal = () => {
  const queryClient = useQueryClient()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateGoalFormData>({
    resolver: zodResolver(createGoalFormSchema),
  })

  async function handleCreateGoal(data: CreateGoalFormData) {
    const { title, desiredWeeklyFrequency } = data

    await createGoal({ title, desiredWeeklyFrequency })

    reset()

    queryClient.invalidateQueries({ queryKey: ['summary'] })
    queryClient.invalidateQueries({ queryKey: ['pending-goals'] })
  }

  return (
    <DialogContent>
      <div className="flex flex-col gap-6 h-full">
        {/* Description */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <DialogTitle>Cadastrar meta</DialogTitle>
            <DialogClose>
              <X className="size-4 text-zinc-600" />
            </DialogClose>
          </div>

          <DialogDescription>
            Adicione atividades que te fazem bem e que você quer continuar
            praticando toda semana.
          </DialogDescription>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(handleCreateGoal)}
          className="flex flex-1 flex-col justify-between"
        >
          {/* Top */}
          <div className="flex flex-col gap-6">
            {/* Activity Input */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Qual a atividade?</Label>
              <Input
                {...register('title')}
                id="title"
                autoFocus
                placeholder="Praticar exercícios, meditar, etc ..."
              />
              {errors.title && (
                <p className="text-red-400 text-sm">{errors.title.message}</p>
              )}
            </div>

            {/* Frequency Input */}
            <div className="flex flex-col gap-2 overflow-y-auto">
              <Label>Quantas vezes na semana?</Label>
              <Controller
                control={control}
                name="desiredWeeklyFrequency"
                defaultValue={Number(FREQUENCY_OPTIONS[0].value)}
                render={({ field }) => {
                  return (
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={String(field.value)}
                    >
                      {FREQUENCY_OPTIONS.map(option => (
                        <RadioGroupItem key={option.value} value={option.value}>
                          <RadioGroupIndicator />
                          <span className="text-zinc-300 text-sm font-medium leading-none">
                            {option.label}
                          </span>
                          <span className="text-lg leading-none">
                            {option.icon}
                          </span>
                        </RadioGroupItem>
                      ))}
                    </RadioGroup>
                  )
                }}
              />
            </div>
          </div>

          {/* Bottom */}
          <div className="flex items-center gap-3">
            <DialogClose asChild>
              <Button type="button" className="flex-1" variant="secondary">
                Fechar
              </Button>
            </DialogClose>
            <Button className="flex-1">Salvar</Button>
          </div>
        </form>
      </div>
    </DialogContent>
  )
}
