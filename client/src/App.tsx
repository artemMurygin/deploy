import { Button } from '@/components/ui/button.tsx';
import { useAppDispatch } from '@/redux/store.ts';
import { userLogoutThunk } from '@/redux/user.slice.ts';


function App() {
    const dispatch = useAppDispatch()

    const handler = () => {
        dispatch(userLogoutThunk())
    }

    return (
        <div className="flex min-h-svh flex-col items-center justify-center">
            <Button onClick={() => {handler()}}>Click me</Button>
        </div>
    )
}

export default App

