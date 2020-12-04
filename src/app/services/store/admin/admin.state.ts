
export default class AdminState {
  customers?: Array<any>;
  carts?: Array<any>;
  orders?: Array<any>;
  AdminError: Error;
}

export const initializeState = (): AdminState => {
  return { AdminError: null };
};
