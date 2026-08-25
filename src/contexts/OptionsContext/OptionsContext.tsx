import { Dispatch, ReactNode, createContext, useEffect, useState } from "react"
import { isUrlSyncManaged } from "@/background/storage/storageManager.ts"
import { usePersistentReducer } from "@/hooks/usePersistedReducer"
import defaultLabels from "@/options/defaulLabels.ts"
import { optionsReducer } from "@/options/options.ts"
import { Options, OptionsAction } from "@/options/types.ts"

const OptionsContext = createContext<
  | {
      options: Options
      isInitialized: boolean
      dispatch: Dispatch<OptionsAction>
    }
  | undefined
>(undefined)

export { OptionsContext }

export const OptionsProvider = ({ children }: { children: ReactNode }) => {
  const [defaultState, setDefaultState] = useState<Options | null>(null)

  // Check if URL sync is managed before initializing
  useEffect(() => {
    const checkManaged = async () => {
      const isManaged = await isUrlSyncManaged()
      if (isManaged) {
        // If managed, don't apply default labels
        setDefaultState({
          isActive: true,
          labels: [],
        })
      } else {
        // Normal user: use default labels
        setDefaultState({
          isActive: true,
          labels: defaultLabels,
        })
      }
    }
    checkManaged()
  }, [])

  // Don't render until we've determined the default state
  if (!defaultState) {
    return null
  }

  return (
    <OptionsProviderInner defaultState={defaultState}>
      {children}
    </OptionsProviderInner>
  )
}

const OptionsProviderInner = ({
  children,
  defaultState,
}: {
  children: ReactNode
  defaultState: Options
}) => {
  const { state, isInitialized, dispatch } = usePersistentReducer<
    Options,
    OptionsAction
  >(
    optionsReducer,
    {
      labels: [],
      isActive: false,
    },
    defaultState,
    "options"
  )

  return (
    <OptionsContext.Provider
      value={{ options: state, isInitialized, dispatch }}
    >
      {children}
    </OptionsContext.Provider>
  )
}
