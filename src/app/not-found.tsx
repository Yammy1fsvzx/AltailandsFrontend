import Link from 'next/link'
import { Button } from '@/components/ui/button' // Assuming you have a Button component
import { AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0e463e] to-[#0c3c34] text-white px-4">
      <div className="text-center space-y-6 p-8 bg-white/5 backdrop-blur-md rounded-lg shadow-xl max-w-md w-full">
        <AlertTriangle className="mx-auto h-16 w-16 text-[#25BD6B]" />
        <h1 className="text-5xl font-bold">404</h1>
        <h2 className="text-2xl font-semibold">Страница не найдена</h2>
        <p className="text-gray-300">
          К сожалению, запрошенная вами страница не существует или была перемещена.
        </p>
        <Button asChild variant="secondary"> 
          <Link href="/">Вернуться на главную</Link>
        </Button>
      </div>
    </div>
  )
} 