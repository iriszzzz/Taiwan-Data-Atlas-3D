import { Pane } from 'tweakpane';
import * as EssentialsPlugin from '@tweakpane/plugin-essentials';

let pane : Pane;
let fpsGraph : any;

export const useTweakPane = () => {
    pane = new Pane;
    pane.registerPlugin(EssentialsPlugin);
    fpsGraph = pane.addBlade({
        view: 'fpsgraph',
        label: 'fpsgraph',
    });

    return {pane, fpsGraph};
};
