import { Button } from '@/components/ui/button.tsx';
import { useContext } from 'react';
import { MainContext } from '@/context/MainContext.tsx';


function App() {
    const { setUser } = useContext(MainContext)
    return (
        <div className="flex min-h-svh flex-col items-center justify-center">
            <Button onClick={() => {setUser(undefined)}}>Click me</Button>
        </div>
    )
}

export default App

