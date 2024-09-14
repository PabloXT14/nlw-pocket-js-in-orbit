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

const FREQUENCY_OPTIONS = [
  { value: '1', label: '1x na semana', icon: '🥱' },
  { value: '2', label: '2x na semana', icon: '🙂' },
  { value: '3', label: '3x na semana', icon: '😎' },
  { value: '4', label: '4x na semana', icon: '😜' },
  { value: '5', label: '5x na semana', icon: '🤨' },
  { value: '6', label: '6x na semana', icon: '🤯' },
  { value: '7', label: 'Todos dias da semana', icon: '🔥' },
]

export const CreateGoal = () => {
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
        <form className="flex flex-1 flex-col justify-between">
          {/* Top */}
          <div className="flex flex-col gap-6">
            {/* Activity Input */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Qual a atividade?</Label>
              <Input
                id="title"
                autoFocus
                placeholder="Praticar exercícios, meditar, etc ..."
              />
            </div>

            {/* Frequency Input */}
            <div className="flex flex-col gap-2">
              <Label>Quantas vezes na semana?</Label>
              <RadioGroup>
                {FREQUENCY_OPTIONS.map(option => (
                  <RadioGroupItem key={option.value} value={option.value}>
                    <RadioGroupIndicator />
                    <span className="text-zinc-300 text-sm font-medium leading-none">
                      {option.label}
                    </span>
                    <span className="text-lg leading-none">{option.icon}</span>
                  </RadioGroupItem>
                ))}
              </RadioGroup>
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
