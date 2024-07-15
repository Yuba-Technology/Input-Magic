import { BlockSharedProperties } from "@/data/map/block";

const basicBlocks: {
    type: string;
    sharedProperties: BlockSharedProperties;
}[] = [
    {
        type: "air",
        sharedProperties: {
            hardness: -1
        }
    },
    {
        type: "dirt",
        sharedProperties: {
            hardness: 0.5
        }
    }
];

export { basicBlocks };
