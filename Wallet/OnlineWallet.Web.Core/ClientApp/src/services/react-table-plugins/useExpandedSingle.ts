import { actions, ActionType, ensurePluginOrder, Hooks, TableInstance, TableState } from "react-table";

function reducer<T extends object>(newState: TableState<T>, action: ActionType, previousState?: TableState<T>, instance?: TableInstance<T>) {
  if (actions.toggleRowExpanded) {
    const { id } = action;
    for (const key of Object.keys(newState.expanded)) {
      if (key !== id) {
        delete newState.expanded[key];
      }
    }
  }
  return newState;
}

function useInstance<T extends object>(instance: TableInstance<T>) {
  ensurePluginOrder(instance.plugins, ["useExpanded"], "useExpandedSingle");
}

export function useExpandedSingle<T extends object>(hooks: Hooks<T>) {
  hooks.stateReducers.push(reducer);
  hooks.useInstance.push(useInstance);
}

useExpandedSingle.pluginName = "useExpandedSingle";
