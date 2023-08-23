export const updateObj = <T extends object, U extends object>(oldObj: T, updatedProps: U): T & U => ({
  ...oldObj,
  ...updatedProps,
});