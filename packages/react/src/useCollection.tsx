import { useEffect, useState } from 'react'
import { Collection, Query, SpacetimeError, CollectionDocument } from '@spacetimexyz/client'

export interface UseCollectionReturnValue<T> {
  error: SpacetimeError|null
  data: CollectionDocument<T>[]|null
  loading: boolean
}

export function useCollection<T=any> (collection?: Collection<T>|Query<T>|null): UseCollectionReturnValue<T> {
  const [res, setResult] = useState<UseCollectionReturnValue<T>>({ error: null, data: null, loading: true })
  const key = collection?.key()

  useEffect(() => {
    if (!collection) return
    setResult({ ...res, loading: true })
    const unsub = collection.onSnapshot((data) => {
      setResult({ data, error: null, loading: false })
    }, (err) => {
      setResult({ data: res.data, error: err, loading: false })
    })
    return unsub
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return res
}