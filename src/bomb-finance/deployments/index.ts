import { AbiCoder } from "ethers/lib/utils";

export type Deployments = {
    [contractName: string]: {
      address: string;
      abi: any[];
    };
  };