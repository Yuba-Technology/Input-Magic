import { BudType, BudUpdater } from "@/data/bud/types";
import { NormalUpdate } from "@/data/bud/normal";

const handlers: { [key: string]: BudUpdater } = {
    normal: new NormalUpdate()
};

class BudHandlerFactory {
    private static updaters = handlers;

    static getAllHandlers(): BudUpdater[] {
        return Object.values(BudHandlerFactory.updaters);
    }

    static getHandler(type: string): BudUpdater {
        return BudHandlerFactory.updaters[type];
    }

    static getHandlerByType(type: BudType): BudUpdater {
        return Object.values(BudHandlerFactory.updaters)[type];
    }
}

export default BudHandlerFactory;
