import React from 'react'

// eslint-disable-next-line import/prefer-default-export
export const useDate = () => {
  const locale = 'en'
  const [today, setDate] = React.useState(new Date())

  React.useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date())
    }, 60 * 1000)
    return () => {
      clearInterval(timer)
    }
  }, [])

  const day = today.toLocaleDateString(locale, { weekday: 'long' })
  const date = `${day}, ${today.getDate()} ${today.toLocaleDateString(locale, {
    month: 'long',
  })}\n\n`

  const hour = today.getHours()
  const wish = `Good ${
    (hour < 12 && 'Morning') || (hour < 17 && 'Afternoon') || 'Evening'
  }, `

  const time = today.toLocaleTimeString(locale, {
    hour: 'numeric',
    hour12: true,
    minute: 'numeric',
  })

  return {
    date,
    time,
    wish,
  }
}
