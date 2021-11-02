import { createSignal, createEffect, Show } from 'solid-js'

export default properties => {
  const [loading, setLoading] = createSignal(false)
  createEffect(() => {
    if (properties.loading) {
      setTimeout(() => {
        setLoading(properties.loading)
      }, 300)
    } else {
      setLoading(false)
    }
  })

  return (
    <Show
      when={!loading()}
      fallback={<div>Loading ...</div>}
    >
      {properties.children}
    </Show>
  )
}
