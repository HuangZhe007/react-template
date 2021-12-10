export const basicActions = (type: string, payload?: any) => ({
  type,
  payload,
});

export type BasicActions = {
  dispatch: (actions: { type: string; payload: any }) => void;
};
