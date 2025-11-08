import { useEffect, useState } from 'react'

export const UseFetch = ({url}) => {

    const [data, setData] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {

        const getDate = async() => {
            setIsPending(true)
            try{
                const res = await fetch(url)
                if(!res.ok) throw new Error("serverda xatolik bor")
                const result = await res.json()
                setData(result)
                setIsPending(false)

            } catch (err){
                setIsPending(false)
                setError(err.message)
            }
        }
        console.log(data);
        
        getDate()

    }, [url])



  return {data, isPending, error, setData}
}
