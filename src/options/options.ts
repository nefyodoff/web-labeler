import { Options, OptionsAction } from "./types.ts";
import { v4 as uuidv4 } from "uuid";

export const optionsReducer = (options: Options, action: OptionsAction) => {
  switch (action?.type) {
    case "addLabel":
      return {
        ...options,
        labels: [
          ...options.labels,
          {
            id: uuidv4(),
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
    case "toggleLabelStatus":
      return {
        ...options,
        labels: options.labels.map((label) =>
          label.id === action.payload.id
            ? { ...label, isActive: !label.isActive }
            : label,
        ),
      };
    case "deleteLabel":
      return {
        ...options,
        labels: options.labels.filter(
          (label) => label.id !== action.payload.id,
        ),
      };
    case "deleteAllLabels":
      return {
        ...options,
        labels: [],
      };
    case "reorderLabels": {
      const labels = [...options.labels];
      labels.splice(
        action.payload.destinationIndex,
        0,
        labels.splice(action.payload.sourceIndex, 1)[0],
      );
      return {
        ...options,
        labels,
      };
    }
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
