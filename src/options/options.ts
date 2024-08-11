import { Options, OptionsAction } from "./types.ts";

export const optionsReducer = (options: Options, action: OptionsAction) => {
  switch (action?.type) {
    case "addLabel":
      return {
        ...options,
        labels: [
          ...options.labels,
          {
            id: Symbol(),
            ...action.payload.label,
          },
        ],
      };
    case "updateLabel":
      return {
        ...options,
        labels: options.labels.map((label) =>
          label.id === action.payload.label.id ? action.payload.label : label,
        ),
      };
    case "deleteLabel":
      return {
        ...options,
        labels: options.labels.filter(
          (label) => label.id === action.payload.id,
        ),
      };
    case "toggleActive":
      return {
        ...options,
        isActive:
          typeof action.payload?.force !== "undefined"
            ? action.payload?.force
            : !options.isActive,
      };
    case "initialize":
      return action.payload;
  }
};
