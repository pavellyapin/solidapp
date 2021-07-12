
export default class AdminState {
  env?: any;
  customers?: Array<any>;
  carts?: Array<any>;
  orders?: Array<any>;
  newOrders?: Array<any>;
  stats?:any;
  subscriptions?: Array<any>;
  AdminError: Error;
}

export const initializeState = (): AdminState => {
  return { AdminError: null };
};
