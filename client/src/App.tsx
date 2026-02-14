import { useContext } from 'react';
import { MainContext } from './context/MainContext.tsx';


function App() {
    const { user } = useContext(MainContext)

    if (!user) {
        return (
            <div>
                Ошибка, пользователя нет :(
            </div>
        )
    }

    return (
        <>
            <div>
                App Запущен, привет, {user.name}!
            </div>
        </>
    )
}

export default App
