import logoInOrbit from './assets/logo-in-orbit.svg'
import letsStartIllustration from './assets/lets-start-illustration.svg'
import { Plus } from 'lucide-react'
import { Button } from './components/ui/button'

export function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8">
      <img src={logoInOrbit} alt="logo in orbit" />
      <img src={letsStartIllustration} alt="lets start illustration" />

      <p className="text-zinc-300 leading-relaxed max-w-80 text-center">
        Você ainda não cadastrou nenhuma meta, que tal cadastrar uma agora
        mesmo?
      </p>

      <Button>
        <Plus className="size-4" />
        Cadastrar meta
      </Button>
    </div>
  )
}
