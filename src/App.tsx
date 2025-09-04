import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { create } from "zustand"

// Simple Zustand store
interface CounterState {
  count: number
  increase: () => void
}

const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increase: () => set((state) => ({ count: state.count + 1 })),
}))

export default function App() {
  const { count, increase } = useCounterStore()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 space-y-6">
      {/* Welcome Header */}
      <h1 className="text-4xl font-bold text-center">
        👋 Welcome to Tech Portal
      </h1>
      <p className="text-lg text-center text-gray-600 max-w-md">
        Start here! Explore your projects, manage tasks, and track progress in one place.
      </p>

      {/* Start Button */}
      <Button className="flex items-center gap-2" onClick={increase}>
        <Plus className="h-4 w-4" /> Start Here
      </Button>

      {/* Interactive Counter */}
      {count > 0 && (
        <p className="text-lg text-blue-600">
          You've clicked start {count} {count === 1 ? "time" : "times"}!
        </p>
      )}
    </div>
  )
}
