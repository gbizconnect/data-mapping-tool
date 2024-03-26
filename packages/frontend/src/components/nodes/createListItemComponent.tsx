import { FC } from 'react';
import { NodeItemComponent } from './nodeItem';

const generateElement = (key: string, value: any, depth: number, address: string, sourceFlg: boolean, openFlgAry: string[], setOpenFlgAry: any, nodeId: string, parent: boolean, scrollTop, scrollLeft, clientHeight, scrollWidth, clientWidth, resizeFlg: boolean) => {
    return (
        <NodeItemComponent itemName={key} depth={depth} parent={parent} address={address} sourceFlg={sourceFlg} openFlgAry={openFlgAry} setOpenFlgAry={setOpenFlgAry} nodeId={nodeId} scrollTop={scrollTop} scrollLeft={scrollLeft} clientHeight={clientHeight} scrollWidth={scrollWidth} clientWidth={clientWidth} resizeFlg={resizeFlg}/>
    );
}

function generateData(data: { [x: string]: any; }, depth: number, address: string, sourceFlg: boolean, openFlgAry: any, setOpenFlgAry: any, nodeId: string, scrollTop, scrollLeft, clientHeight, scrollWidth, clientWidth, resizeFlg) {
    const newData = Object.keys(data).reduce((result: any, currentKey) => {
        if (typeof data[currentKey] === 'string' || data[currentKey] instanceof String) {
            var elementToPush = generateElement(currentKey, data[currentKey], depth, address, sourceFlg, openFlgAry, setOpenFlgAry, nodeId, false, scrollTop, scrollLeft, clientHeight, scrollWidth, clientWidth, resizeFlg);
            result.push(elementToPush);
        } else {
            var elementToPush = generateElement(currentKey, data[currentKey], depth, address, sourceFlg, openFlgAry, setOpenFlgAry, nodeId, true, scrollTop, scrollLeft, clientHeight, scrollWidth, clientWidth, resizeFlg);
            result.push(elementToPush);
            const nested = generateData(data[currentKey], depth + 1, (address === "" ? '' : address + '.') + currentKey, sourceFlg, openFlgAry, setOpenFlgAry, nodeId, scrollTop, scrollLeft, clientHeight, scrollWidth, clientWidth, resizeFlg);
            result.push(...nested);
        }
        return result;
    }, []);
    return newData;
}

export const ListItemComponent: FC<{ items: any; sourceFlg: boolean; openFlgAry: any; setOpenFlgAry: any; nodeId: string, scrollTop, scrollLeft, clientHeight ,scrollWidth, clientWidth, resizeFlg:boolean}> = ({
    items, sourceFlg, openFlgAry, setOpenFlgAry, nodeId, scrollTop, scrollLeft, clientHeight, scrollWidth, clientWidth, resizeFlg
}) => {
    return (
        <div>
            {generateData(items, 0, '', sourceFlg, openFlgAry, setOpenFlgAry, nodeId, scrollTop, scrollLeft, clientHeight, scrollWidth, clientWidth, resizeFlg)}
        </div>
    );
};
